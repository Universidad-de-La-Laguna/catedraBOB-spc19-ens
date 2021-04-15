pragma solidity ^0.4.18;

/**
 * @title Seriality
 * @dev The Seriality contract is the main interface for serializing data using the TypeToBytes, BytesToType and SizeOf
 * @author pouladzade@gmail.com
 */
contract Seriality {

    constructor () public { }

    function sizeOfString(string _in) internal pure  returns(uint _size){
        _size = bytes(_in).length / 32;
        if (bytes(_in).length % 32 != 0)
            _size++;

        _size++; // first 32 bytes is reserved for the size of the string
        _size *= 32;
    }

    function boolToBytes(uint _offst, bool _input, bytes memory _output) internal pure {
        uint8 x = _input == false ? 0 : 1;
        assembly {
            mstore(add(_output, _offst), x)
        }
    }

    function stringToBytes(uint _offst, bytes memory _input, bytes memory _output) internal pure {
        uint256 stack_size = _input.length / 32;
        if(_input.length % 32 > 0) stack_size++;

        stack_size++;
        for (uint index = 0; index < stack_size; index++) {
            assembly {
                mstore(add(_output, _offst), mload(add(_input,mul(index,32))))
                _offst := sub(_offst , 32)
            }
        }
    }

    function uintToBytes(uint _offst, uint _input, bytes memory _output) internal pure {
        assembly {
            mstore(add(_output, _offst), _input)
        }
    }
}

/**
 * @title ReservationContract
 * @dev The ReservationContract contract is the interface for TraceTorurismTrust (T3) system
 * @author Open Canarias SL
 */
contract ReservationContract is Seriality {

    /*
    * Events
    */

    event RegisterProductEvent(
      string providerEmail,
      string reservationId
    );

    event ValidationDoneEvent(
      string customerEmail,
      string reservationId,
      uint productId
    );

    /*
    * Storage
    */

    address owner;

    string id;
    string crsId;
    string sellChannel;
    Product[] products;
    uint totalPrice;
    Customer customer;

    struct Customer {
        string name;
        string surname;
        string email;
        string country;
    }

    struct Product {
        uint id; // linea de reserva
        //  string productId;
        string name;
        uint price;
        uint numAdults;
        uint numChildren;
        uint numBabies;
        Provider provider;
        bool isValidated;
    }

    struct Provider {
        string id;
        string name;
        string email;
        address account;
    }

    /**
    * @dev Contract constructor
    */
    constructor (
        string _id,
        string _crsId,
        string _sellChannel,
        string customerName,
        string customerSurname,
        string customerEmail,
        string customerCountry
    ) public {
        owner = msg.sender;

        id = _id;
        crsId = _crsId;
        sellChannel = _sellChannel;

        customer = Customer({
            name: customerName,
            surname: customerSurname,
            email: customerEmail,
            country: customerCountry
        });

        totalPrice = 0;
    }

    /*
     * Public functions
     */

    /**
     * @dev Register Product in a reservation
     */
    function registerProduct(
        uint _id,
        string _name,
        uint _price,
        uint _numAdults,
        uint _numChildren,
        uint _numBabies,
        string providerId,
        string providerName,
        string providerEmail,
        address _providerAccount
    ) public {
        require(msg.sender == owner);

        products.push(Product({
            id: _id,
            name: _name,
            price: _price,
            numAdults: _numAdults,
            numChildren: _numChildren,
            numBabies: _numBabies,
            provider: Provider({
                id: providerId,
                name: providerName,
                email: providerEmail,
                account: _providerAccount
            }),
            isValidated: false
        }));

        totalPrice += _price;

        emit RegisterProductEvent(providerEmail, id);
    }

    /**
     * @dev Get reservation info
     */
    function getReservation() public view returns (bytes, bytes) {
        bytes memory reservationSerialized = serializeReservation();
        bytes memory productsSerialized = serializeProducts();

        return (reservationSerialized, productsSerialized);
    }

    /**
     * @dev Validate Reservation
     * @param productId uint productId
     */
    function validateReservation(uint productId) public returns (bool validated) {
        require(owner != msg.sender, "must be an provider");

        validated = false;
        for (uint i = 0; i < products.length; i++) {
            if (products[i].provider.account == msg.sender) {
                if (products[i].id == productId) {
                    require(! products[i].isValidated, "reservation already validated");

                    products[i].isValidated = true;

                    validated = true;
                }
            }
        }

        emit ValidationDoneEvent(customer.email, id, productId);
    }

    /**
     * @dev Get number of products
     */
    function getProductsCount() public view returns (uint) {
        return products.length;
    }

    /**
     * @dev Get total price
     */
    function getTotalPrice() public view returns (uint) {
        return totalPrice;
    }

    /*
     * Helper functions
     */

    function serializeReservation() private view returns (bytes) {
        uint sizeOfUint256 = 32;

        uint buffer_size = sizeOfUint256 +
            sizeOfString(id) +
            sizeOfString(crsId) +
            sizeOfString(sellChannel) +
            sizeOfString(customer.name) +
            sizeOfString(customer.surname) +
            sizeOfString(customer.email) +
            sizeOfString(customer.country);

        bytes memory buffer = new bytes(buffer_size);

        uint offset = buffer_size;

        // serialize totalPrice
        uintToBytes(offset, totalPrice, buffer);
        offset -= sizeOfUint256;

        stringToBytes(offset, bytes(id), buffer);
        offset -= sizeOfString(id);

        stringToBytes(offset, bytes(crsId), buffer);
        offset -= sizeOfString(crsId);

        stringToBytes(offset, bytes(sellChannel), buffer);
        offset -= sizeOfString(sellChannel);

        stringToBytes(offset, bytes(customer.name), buffer);
        offset -= sizeOfString(customer.name);

        stringToBytes(offset, bytes(customer.surname), buffer);
        offset -= sizeOfString(customer.surname);

        stringToBytes(offset, bytes(customer.email), buffer);
        offset -= sizeOfString(customer.email);

        stringToBytes(offset, bytes(customer.country), buffer);
        offset -= sizeOfString(customer.country);

        return buffer;
    }

    function serializeProducts() private view returns (bytes) {
        uint sizeOfBool = 1;
        uint sizeOfUint256 = 32;
        uint numBoolFields = 1;
        uint numUintFields = 5;
        uint numStringFields = 3;

        uint buffer_size = products.length * (
            numBoolFields * sizeOfBool +
            numUintFields * sizeOfUint256 + 
            numStringFields * 64
        );

        bytes memory buffer = new  bytes(buffer_size);

        uint offset = buffer_size;

        for(uint i = 0; i <= products.length - 1; i++) {
            // serialize isValidated
            boolToBytes(offset, products[i].isValidated, buffer);
            offset -= sizeOfBool;

            // serialize id
            uintToBytes(offset, products[i].id, buffer);
            offset -= sizeOfUint256;

            // serialize price
            uintToBytes(offset, products[i].price, buffer);
            offset -= sizeOfUint256;

            // serialize numAdults
            uintToBytes(offset, products[i].numAdults, buffer);
            offset -= sizeOfUint256;

            // serialize numChildren
            uintToBytes(offset, products[i].numChildren, buffer);
            offset -= sizeOfUint256;

            // serialize numBabies
            uintToBytes(offset, products[i].numBabies, buffer);
            offset -= sizeOfUint256;

            // serialize name
            stringToBytes(offset, bytes(products[i].name), buffer);
            offset -= sizeOfString(products[i].name);

            // serialize providerId
            stringToBytes(offset, bytes(products[i].provider.id), buffer);
            offset -= sizeOfString(products[i].provider.id);

            // serialize providerName
            stringToBytes(offset, bytes(products[i].provider.name), buffer);
            offset -= sizeOfString(products[i].provider.name);
        }

        return buffer;
    }

}