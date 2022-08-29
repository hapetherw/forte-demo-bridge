Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "solana_contract",
    "instructions": [
        {
            "name": "initializeLock",
            "accounts": [
                {
                    "name": "nftLockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "userAccount",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "nftMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "nftAuthNonce",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "lockNft",
            "accounts": [
                {
                    "name": "nftLockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userAccount",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "userNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "unlockNft",
            "accounts": [
                {
                    "name": "userAccount",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "nftLockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userNftTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "nftAuth",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ]
};
