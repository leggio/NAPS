//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TotallyNAPS is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _topLevels;

    uint256 public _level;
    address _parent;
    address _daoAddress;

    uint256 napCount;
    struct Nap {
      address parent;
      uint256 level;
    }
    mapping(uint256 => Nap) naps;

    constructor() ERC721("TotallyNAPS", "NAPS") {
      napCount = 0;
    }

    function mintTopLevelNFT(address recipient, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(msg.value <= 250000000000000000, "not enough ETH to mint top level NAP");
        _tokenIds.increment();
        _topLevels.increment();
        _level = 1;
        _parent = _daoAddress;

        Nap memory newNap = Nap(_daoAddress, 1);
        naps[napCount] = newNap;
        napCount += 1;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        (bool success, ) = _daoAddress.call{ value: msg.value }("");
        require(success, "Transfer Failed");

        return newItemId;
    }

    function mintNFT(address recipient, address parent, string memory tokenURI)
        public
        payable
        returns (uint256)
    {
        require(msg.value <= 100000000000000000, "not enough ETH to mint child NAP");
        _tokenIds.increment();

        _level += 1;
        _parent = parent;

        parent = naps[napCount].parent;
        Nap memory newNap = Nap(parent, napCount + 1);
        naps[napCount] = newNap;
        napCount += 1;

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        (bool success, ) = _daoAddress.call{ value: msg.value }("");
        require(success, "Transfer Failed");

        return newItemId;
    }

}
