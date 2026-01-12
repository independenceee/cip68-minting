<div align="center">

<img src="public/logo.png" width="120" alt="CIP-68 NFT Standard Logo" />

# **CIP-68 NFT Reference Implementation**

**A comprehensive implementation of the CIP-68 (On-Chain Referential Datum) standard for Cardano NFTs with Aiken smart contracts**

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Aiken](https://img.shields.io/badge/Aiken-Smart%20Contracts-orange?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY2NjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTExLjUgM0M2LjI1IDMgMiA3LjI1IDIgMTJzNC4yNSA5IDkuNSA5IDkuNS00LjI1IDkuNS05LTQuMjUtOS41LTktOS41eiIvPjwvc3ZnPg==)](https://aiken-lang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-L1-green?logo=cardano)](https://cardano.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

</div>

## About CIP-68 NFT Reference Implementation

This project is a reference implementation of the **CIP-68 (On-Chain Referential Datum)** standard for Cardano NFTs. CIP-68 introduces a new approach to NFT metadata management by separating mutable metadata from immutable NFT tokens, enabling dynamic NFT properties while maintaining blockchain efficiency.

This implementation provides:
- **Aiken-based smart contracts** for CIP-68 compliant minting and metadata management
- **Next.js frontend** for user interaction and NFT visualization
- **Mesh SDK integration** for seamless wallet connectivity and transaction building
- **Blockfrost API integration** for blockchain data queries
- **Comprehensive documentation** for developers learning CIP-68

The project serves as both a practical tool for creating CIP-68 compliant NFTs and an educational resource for understanding Cardano's advanced metadata standards.

### Key Benefits

-   **Dynamic Metadata**: Update NFT properties on-chain without reissuing tokens
-   **Efficient Storage**: Separate reference token from metadata datum to reduce on-chain bloat
-   **Developer-Friendly**: Aiken smart contracts ensure safe, auditable code
-   **Scalable Architecture**: Modular design supports multiple use cases (gaming, collectibles, credentials)
-   **Wallet Integration**: Support for major Cardano wallets via CIP-30 standard
-   **Real-time Updates**: WebSocket support for live metadata changes

### Use Cases

-   **Dynamic Gaming Assets**: NFTs with mutable attributes (level, stats, inventory)
-   **Verifiable Credentials**: Educational certificates and professional credentials
-   **Collectible Series**: Limited edition collections with evolving properties
-   **Digital Assets**: Real-world asset tokenization with dynamic pricing

---

## 🌐 Features

-   **CIP-68 Minting**  
    Create NFTs following the CIP-68 standard with reference tokens and metadata datums. Supports custom metadata schemas and validation.

-   **Metadata Management**  
    Update NFT metadata on-chain without reissuing tokens. Full control over mutable and immutable properties.

-   **Wallet Integration**  
    Seamless integration with Nami, Eternl, Flint, Lace, and other CIP-30 compatible wallets.

-   **Transaction Building**  
    Mesh SDK-powered transaction builder for minting, burning, and metadata updates.

-   **Blockchain Explorer Integration**  
    Real-time querying via Blockfrost API for transaction status and NFT ownership verification.

-   **Comprehensive Validation**  
    Aiken smart contracts ensure all CIP-68 requirements are met before on-chain settlement.

---

## 🛠️ Technology Stack

| Component           | Technologies                                 | Purpose                                                          |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **Frontend**        | Next.js 13, React, TypeScript, TailwindCSS   | User interface for NFT creation and management                    |
| **Blockchain**      | Mesh SDK, CIP-30, Blockfrost API             | Wallet integration and blockchain interaction                     |
| **Smart Contracts** | Aiken (compiles to Plutus Core)              | Secure CIP-68 validation and minting logic                        |
| **Transaction**     | Mesh TxBuilder                               | High-level transaction construction                               |
| **Data**            | TypeScript interfaces, Plutus JSON           | Type-safe data structures and contract exports                    |

---

## ⚡ Getting Started

Prerequisites: Node.js 18+, npm/yarn, and a Cardano wallet with testnet ADA.

1. **Clone the Repository**

    ```bash
    git clone https://github.com/independenceee/cip68.git
    cd cip68
    ```

2. **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure Environment**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with:
    - `BLOCKFROST_API_KEY`: Get from [Blockfrost](https://blockfrost.io/)
    - `NETWORK`: Set to `preview` or `mainnet`
    - `CARDANO_NETWORK`: Network configuration

4. **Build Smart Contracts**

    ```bash
    cd contract
    aiken build
    ```

5. **Run Locally**

    ```bash
    npm run dev
    ```

    Access at [http://localhost:3000](http://localhost:3000)

6. **Build for Production**

    ```bash
    npm run build
    npm start
    ```

---

## 📁 Project Structure

```
├── app/                    # Next.js pages and layouts
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── adapters/              # Blockchain adapters
│   └── mesh.adapter.ts    # Mesh SDK adapter
├── providers/             # Blockchain providers
│   └── blockfrost.provider.ts  # Blockfrost integration
├── txbuilders/            # Transaction builders
│   └── mesh.txbuilder.ts  # Transaction construction logic
├── libs/                  # Utilities
│   └── utils.ts           # Helper functions
├── constants/             # Application constants
│   ├── common.constant.ts # Common configurations
│   └── enviroments.constant.ts  # Environment settings
├── types/                 # TypeScript definitions
│   └── index.d.ts         # Type definitions
├── contract/              # Smart contracts
│   ├── lib/               # Aiken library modules
│   ├── validators/        # Plutus validators
│   ├── aiken.toml         # Aiken configuration
│   └── plutus.json        # Compiled Plutus Core
├── tests/                 # Test suite
│   └── mesh.test.ts       # Integration tests
└── README.md              # This file
```

---

## 🧑‍💻 Developer Notes

-   **CIP-68 Standard**: Reference tokens hold the NFT identity, while metadata datums store mutable properties
-   **Smart Contracts**: Located in `contract/validators/` - mint.ak and store.ak handle minting and updates
-   **Testing**: Run `npm test` for Jest unit tests
-   **Extending**: Add new validators in `contract/validators/` and compile with `aiken build`
-   **Type Safety**: Leverage TypeScript for frontend and Aiken for smart contracts

For detailed CIP-68 specification, see [CIP-68 Documentation](https://cips.cardano.org/cips/cip68/).

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork and create a feature branch
2. Commit with clear messages
3. Push to your fork
4. Open a Pull Request

See CONTRIBUTING.md for guidelines.

---

## 📚 Resources

-   [CIP-68 Specification](https://cips.cardano.org/cips/cip68/)
-   [Aiken Language Book](https://aiken-lang.org/book/)
-   [Mesh SDK Documentation](https://meshjs.dev/)
-   [Cardano Developer Portal](https://developers.cardano.org/)
-   [Blockfrost API Docs](https://docs.blockfrost.io/)

---

## 📝 License

Licensed under the MIT License. Copyright © 2025 independenceee.
