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

    address _daoAddress;

    uint256 napCount;
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
    }
    mapping(uint256 => Event) events;

    constructor() ERC721("TotallyNAPS", "NAPS") {
      napCount = 0;
    }

    function getNapDetails(uint256 nap) 
        public 
        view 
        returns (uint256, uint256, bool, uint256, string memory, uint256)
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

    function getUserNaps(address user)
        public
        view
        returns (string[] memory)
    {
        uint256[] memory userNaps;
        for (uint i = 0; i < allNaps.length; i++) {
            address owner = ERC721.ownerOf(allNaps[i]);
            if (owner == user) {
              userNaps[i] = allNaps[i];
            }
        }

        string[] memory ids;
        for (uint i = 0; i < userNaps.length; i++) {
          ids[i] = naps[userNaps[i]].id;
        }

      return ids;
    }

    function mintTopLevelNFT(address recipient, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(msg.value <= 250000000000000000, "not enough ETH to mint top level NAP");
        _tokenIds.increment();
        _topLevels.increment();

        Nap memory newNap = Nap(0, 1, false, 0, Strings.toString(_topLevels.current()), 0);
        naps[napCount] = newNap;
        napCount += 1;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        (bool success, ) = _daoAddress.call{ value: msg.value }("");
        require(success, "Transfer Failed");

        Event memory newEvent = Event(block.number, newItemId, 1, 250000000000000000);
        events[newItemId] = newEvent;

        allNaps.push(newItemId);

        return newItemId;
    }

    function mintNFT(address recipient, uint256 parent, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        address owner = ERC721.ownerOf(parent);
        require(msg.sender == owner, "Must be owner of parent NAP");

        Nap memory parentNap = naps[parent];
        require(parentNap.children < 2, "You may only mint 2 children");

        require(msg.value <= 100000000000000000, "not enough ETH to mint child NAP");
        _tokenIds.increment();

        string memory parentId = parentNap.id;
        string memory children = Strings.toString(parentNap.children);

        string memory newNapId = string(bytes.concat(bytes(parentId), bytes(children)));
        Nap memory newNap = Nap(parent, napCount + 1, false, 0, newNapId, 0);
        naps[napCount] = newNap;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        (bool success, ) = _daoAddress.call{ value: msg.value }("");
        require(success, "Transfer Failed");

        parentNap.children += 1;

        Event memory newEvent = Event(block.number, newItemId, napCount + 1, 100000000000000000);
        events[newItemId] = newEvent;

        napCount += 1;

        allNaps.push(newItemId);

        return newItemId;
    }

    // function distribute(address recipient, uint256 nap)
    //     public
    //     payable
    //     returns (uint256)
    // {

    //     // get most recent timestamp for nap
    //     // get all children minted after timestamp
    //     // calculate royalty earnings
    //     // send royalty to user
    //     // update timestamp

    //     address owner = ERC721.ownerOf(nap);
    //     require(msg.sender == owner, "Must be owner of NAP to collect royalties");

    //     Nap memory targetNap = naps[nap];
    //     require(targetNap.children > 0, "NAP has no children");

    //     Event memory napEvent = events[nap];
    //     uint256 blocknumber = napEvent.blockNumber;
    //     uint256 level = napEvent.level;




    // }

}
