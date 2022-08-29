/*
Metaplex library
https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/common/src/actions/metadata.ts
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.METADATA_SCHEMA = exports.Metadata = exports.Data = exports.Creator = exports.MetadataKey = exports.EDITION_MARKER_BIT_SIZE = exports.MAX_EDITION_LEN = exports.MAX_METADATA_LEN = exports.MAX_CREATOR_LEN = exports.MAX_CREATOR_LIMIT = exports.MAX_URI_LENGTH = exports.MAX_SYMBOL_LENGTH = exports.MAX_NAME_LENGTH = exports.RESERVATION = exports.EDITION = exports.METADATA_PREFIX = exports.METADATA_PROGRAM_ID = void 0;
var web3_js_1 = require("@solana/web3.js");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
exports.METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
exports.METADATA_PREFIX = 'metadata';
exports.EDITION = 'edition';
exports.RESERVATION = 'reservation';
exports.MAX_NAME_LENGTH = 32;
exports.MAX_SYMBOL_LENGTH = 10;
exports.MAX_URI_LENGTH = 200;
exports.MAX_CREATOR_LIMIT = 5;
exports.MAX_CREATOR_LEN = 32 + 1 + 1;
exports.MAX_METADATA_LEN = 1 +
    32 +
    32 +
    exports.MAX_NAME_LENGTH +
    exports.MAX_SYMBOL_LENGTH +
    exports.MAX_URI_LENGTH +
    exports.MAX_CREATOR_LIMIT * exports.MAX_CREATOR_LEN +
    2 +
    1 +
    1 +
    198;
exports.MAX_EDITION_LEN = 1 + 32 + 8 + 200;
exports.EDITION_MARKER_BIT_SIZE = 248;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["Uninitialized"] = 0] = "Uninitialized";
    MetadataKey[MetadataKey["MetadataV1"] = 4] = "MetadataV1";
    MetadataKey[MetadataKey["EditionV1"] = 1] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 2] = "MasterEditionV1";
    MetadataKey[MetadataKey["MasterEditionV2"] = 6] = "MasterEditionV2";
    MetadataKey[MetadataKey["EditionMarker"] = 7] = "EditionMarker";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var Creator = /** @class */ (function () {
    function Creator(args) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
    return Creator;
}());
exports.Creator = Creator;
var Data = /** @class */ (function () {
    function Data(args) {
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
        this.creators = args.creators;
    }
    return Data;
}());
exports.Data = Data;
var Metadata = /** @class */ (function () {
    function Metadata(args) {
        var _a, _b, _c;
        this.key = MetadataKey.MetadataV1;
        this.updateAuthority = args.updateAuthority;
        this.mint = args.mint;
        this.data = args.data;
        this.primarySaleHappened = args.primarySaleHappened;
        this.isMutable = args.isMutable;
        this.editionNonce = (_a = args.editionNonce) !== null && _a !== void 0 ? _a : null;
        this.collection = (_b = args.collection) !== null && _b !== void 0 ? _b : null;
        this.uses = (_c = args.uses) !== null && _c !== void 0 ? _c : null;
    }
    return Metadata;
}());
exports.Metadata = Metadata;
exports.METADATA_SCHEMA = new Map([
    [
        Data,
        {
            kind: 'struct',
            fields: [
                ['name', 'string'],
                ['symbol', 'string'],
                ['uri', 'string'],
                ['sellerFeeBasisPoints', 'u16'],
                ['creators', { kind: 'option', type: [Creator] }],
            ],
        },
    ],
    [
        Creator,
        {
            kind: 'struct',
            fields: [
                ['address', 'pubkeyAsString'],
                ['verified', 'u8'],
                ['share', 'u8'],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['updateAuthority', 'pubkeyAsString'],
                ['mint', 'pubkeyAsString'],
                ['data', Data],
                ['primarySaleHappened', 'u8'],
                ['isMutable', 'u8'],
                ['editionNonce', { kind: 'option', type: 'u8' }],
            ],
        },
    ],
]);
exports.decodeMetadata = function (pda) { return __awaiter(_this, void 0, void 0, function () {
    var pdaPubKey, connection, buffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pdaPubKey = new web3_js_1.PublicKey(pda);
                connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
                return [4 /*yield*/, connection.getAccountInfo(pdaPubKey)];
            case 1:
                buffer = _a.sent();
                return [2 /*return*/, mpl_token_metadata_1.MetadataData.deserialize(buffer.data)];
        }
    });
}); };
exports.getMetadata = function (tokenMint) { return __awaiter(_this, void 0, void 0, function () {
    var mintPubKey, METADATA_PUBKEY, _a, pda, seeds;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mintPubKey = new web3_js_1.PublicKey(tokenMint);
                METADATA_PUBKEY = new web3_js_1.PublicKey(exports.METADATA_PROGRAM_ID);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([
                        Buffer.from(exports.METADATA_PREFIX),
                        METADATA_PUBKEY.toBuffer(),
                        mintPubKey.toBuffer(),
                    ], METADATA_PUBKEY)];
            case 1:
                _a = _b.sent(), pda = _a[0], seeds = _a[1];
                console.log("Metadata PDA is:", pda.toBase58());
                return [2 /*return*/, pda.toBase58()];
        }
    });
}); };
