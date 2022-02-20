//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TotallyNAPS is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _topLevels;

    uint256[] allNaps;
    uint256[] allEvents;

    address _daoAddress;

    uint256 napCount;
    uint256 topLevelPrice;

    struct slice {
        uint256 _len;
        uint256 _ptr;
    }

    struct Nap {
        uint256 parent;
        uint256 level;
        bool forSale;
        uint256 listPrice;
        string id;
        uint256 children;
    }
    mapping(uint256 => Nap) naps;

    struct Event {
        uint256 blockNumber;
        uint256 nap;
        uint256 level;
        uint256 amount;
        string id;
    }
    mapping(uint256 => Event) events;

    constructor() ERC721("TotallyNAPS", "NAPS") {
        napCount = 0;
        topLevelPrice = 50000000000000000;
    }

    function getNapDetails(uint256 nap)
        public
        view
        returns (
            uint256,
            uint256,
            bool,
            uint256,
            string memory,
            uint256
        )
    {
        Nap memory targetNap = naps[nap];
        return (
            targetNap.parent,
            targetNap.level,
            targetNap.forSale,
            targetNap.listPrice,
            targetNap.id,
            targetNap.children
        );
    }

    function getUserNaps(address user) public view returns (uint256[] memory) {
        bool[] memory userNaps = new bool[](allNaps.length);
        uint256 trueCount = 0;
        for (uint256 i = 0; i < allNaps.length; i++) {
            address owner = ERC721.ownerOf(allNaps[i]);
            if (owner == user) {
                userNaps[i] = true;
                trueCount ++;
            } else {
              userNaps[i] = false;
            }
        }

        uint256[] memory userIds = new uint256[](trueCount);
        uint256 trackTrue = 0;
        for (uint i = 0; i < userNaps.length; i++) {
            if (userNaps[i] == true) {
              userIds[trackTrue] = i;
              trackTrue ++;
            }
        }

        return userIds;
    }

    function getChildren(string memory targetId)
        public
        view
        returns (string[] memory)
    {
        string[] memory ids;

        for (uint256 i = 0; i < allNaps.length; i++) {
            string memory id = naps[allNaps[i]].id;
            if (startsWith(toSlice(id), toSlice(targetId))) {
                ids[i] = id;
            }
        }

        return ids;
    }

    function mintTopLevelNFT(address recipient, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(
            msg.value >= topLevelPrice,
            "not enough ETH to mint top level NAP"
        );
        _tokenIds.increment();
        _topLevels.increment();

        Nap memory newNap = Nap(
            0,
            1,
            false,
            0,
            Strings.toString(_topLevels.current()),
            0
        );
        naps[napCount] = newNap;
        napCount += 1;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        Event memory newEvent = Event(
            block.number,
            newItemId,
            1,
            topLevelPrice,
            Strings.toString(_topLevels.current())
        );
        events[newItemId] = newEvent;

        allNaps.push(newItemId);
        allEvents.push(newItemId);

        topLevelPrice += (topLevelPrice / 10);

        return newItemId;
    }

    function mintNFT(
        address recipient,
        uint256 parent,
        string memory tokenURI
    ) public payable returns (uint256) {
        address owner = ERC721.ownerOf(parent);
        require(msg.sender == owner, "Must be owner of parent NAP");

        Nap memory parentNap = naps[parent];
        require(parentNap.children < 2, "You may only mint 2 children");

        require(
            msg.value <= 25000000000000000,
            "not enough ETH to mint child NAP"
        );
        _tokenIds.increment();

        string memory parentId = parentNap.id;
        string memory children = Strings.toString(parentNap.children);

        string memory newNapId = string(
            bytes.concat(bytes(parentId), bytes(children))
        );
        Nap memory newNap = Nap(parent, napCount + 1, false, 0, newNapId, 0);
        naps[napCount] = newNap;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        parentNap.children += 1;

        Event memory newEvent = Event(
            block.number,
            newItemId,
            napCount + 1,
            25000000000000000,
            newNapId
        );
        events[newItemId] = newEvent;

        napCount += 1;

        allNaps.push(newItemId);
        allEvents.push(newItemId);

        return newItemId;
    }

    function distribute(uint256 nap)
        public
        payable
        returns (uint256)
    {
        address owner = ERC721.ownerOf(nap);
        require(
            msg.sender == owner,
            "Must be owner of NAP to collect royalties"
        );

        Nap memory targetNap = naps[nap];
        require(targetNap.children > 0, "NAP has no children");

        Event memory napEvent = events[nap];
        uint256 blockNumber = napEvent.blockNumber;
        uint256 level = napEvent.level;

        Event[] memory childEvents;

        for (uint256 i = 0; i < allEvents.length; i++) {
            Event memory e = events[allEvents[i]];
            if (startsWith(toSlice(e.id), toSlice(targetNap.id))) {
                if (e.blockNumber > blockNumber) {
                    childEvents[i] = e;
                }
            }
        }

        uint256 runningTotal;

        for (uint256 i = 0; i < childEvents.length; i++) {
            uint256 levelDelta = childEvents[i].level - level;
            uint256 amount = childEvents[i].amount;
            for (uint256 j = 0; j <= levelDelta; j++) {
                runningTotal += amount / 2;
            }
        }

        (bool success, ) = msg.sender.call{ value: runningTotal }("");
        require(success, "Transfer Failed");

        return runningTotal;
    }

    function buyNFT(uint256 nap)
        public
        payable
        returns (uint256)
    {
        Nap memory forSaleNap = naps[nap];

        address owner = ERC721.ownerOf(nap);
        
        require(forSaleNap.listPrice == msg.value, "Insufficient price for NAP");
        require(forSaleNap.forSale == true, "NAP is not for sale");
        ERC721.safeTransferFrom(owner, msg.sender, nap);

        (bool success, ) = owner.call{ value: msg.value }("");
        require(success, "Transfer Failed");

        return nap;
    }

    function listNFT(uint256 nap, uint256 listPrice)
        public
        view
        returns (uint256)
    {
        Nap memory forSaleNap = naps[nap];

        address owner = ERC721.ownerOf(nap);

        require(owner == msg.sender, "You can only sell your own NAP");

        forSaleNap.forSale = true;
        forSaleNap.listPrice = listPrice;

        return nap;
    }

    function unlistNFT(uint256 nap)
        public
        view
        returns (uint256)
    {
        Nap memory forSaleNap = naps[nap];

        address owner = ERC721.ownerOf(nap);

        require(owner == msg.sender, "You can only unlist your own NAP");

        forSaleNap.forSale = false;
        forSaleNap.listPrice = 0;

        return nap;
    }

    /*
     * @dev Returns a slice containing the entire string.
     * @param self The string to make a slice from.
     * @return A newly allocated slice containing the entire string.
     */
    function toSlice(string memory self) internal pure returns (slice memory) {
        uint256 ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    /*
     * @dev Returns true if `self` starts with `needle`.
     * @param self The slice to operate on.
     * @param needle The slice to search for.
     * @return True if the slice starts with the provided text, false otherwise.
     */
    function startsWith(slice memory self, slice memory needle)
        internal
        pure
        returns (bool)
    {
        if (self._len < needle._len) {
            return false;
        }

        if (self._ptr == needle._ptr) {
            return true;
        }

        bool equal;
        assembly {
            let length := mload(needle)
            let selfptr := mload(add(self, 0x20))
            let needleptr := mload(add(needle, 0x20))
            equal := eq(
                keccak256(selfptr, length),
                keccak256(needleptr, length)
            )
        }
        return equal;
    }
}
