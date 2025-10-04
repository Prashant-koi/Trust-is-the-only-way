// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MfaAudit {
    event MfaLogged(bytes32 indexed approvalHash, address indexed merchant, uint256 timestamp);

    function logMfa(bytes32 approvalHash) external {
        emit MfaLogged(approvalHash, msg.sender, block.timestamp);
    }
}

