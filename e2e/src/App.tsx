import "./App.css"
import {
  type ConnectOptions,
  type DisconnectOptions,
  StarknetWindowObject,
  connect,
  disconnect,
} from "@starknet-io/get-starknet"
import { useState } from "react"
import { WalletAccount, constants } from "starknet"

function App() {
  const [walletName, setWalletName] = useState("")
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null)

  async function handleConnect(options?: ConnectOptions) {
    const selectedWalletSWO = await connect(options)

    if (selectedWalletSWO) {
      window.wallet = selectedWalletSWO
      setWallet(selectedWalletSWO)
    }

    setWalletName(selectedWalletSWO?.name || "")
  }

  async function handleDisconnect(options?: DisconnectOptions) {
    await disconnect(options)
    setWalletName("")
    setWallet(null) // Update state to indicate disconnection
  }

  // Test RPC methods
  async function testRPC(method: string) {
    if (!wallet) {
      console.log("No wallet account connected")
      return
    }

    try {
      switch (method) {
        case "wallet_getPermissions":
          console.log(await wallet.request({ type: "wallet_getPermissions" }))
          break
        case "wallet_requestAccounts":
          console.log(await wallet.request({ type: "wallet_requestAccounts" }))
          break
        case "wallet_watchAsset":
          console.log(
            await wallet.request({
              type: "wallet_watchAsset",
              params: {
                type: "ERC20",
                options: {
                  address:
                    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                api_version: "0.7",
              },
            }),
          )
          break
        // Not implemented
        // case "wallet_addStarknetChain":
        //   console.log(await wallet.request({
        //     type: "wallet_addStarknetChain",
        //     params: { chainId: "0x1", chainName: "Starknet Testnet" }
        //   }));
        //   break;
        case "wallet_switchStarknetChain":
          console.log(
            await wallet.request({
              type: "wallet_switchStarknetChain",
              params: { chainId: constants.StarknetChainId.SN_SEPOLIA },
            }),
          )
          break
        case "wallet_requestChainId":
          console.log(await wallet.request({ type: "wallet_requestChainId" }))
          break
        case "wallet_deploymentData":
          console.log(await wallet.request({ type: "wallet_deploymentData" }))
          break
        case "wallet_addInvokeTransaction":
          console.log(
            await wallet.request({
              type: "wallet_addInvokeTransaction",
              params: {
                /* invoke transaction params */
              },
            }),
          )
          break
        case "wallet_addDeclareTransaction":
          console.log(
            await wallet.request({
              type: "wallet_addDeclareTransaction",
              params: {
                /* declare transaction params */
              },
            }),
          )
          break
        case "wallet_signTypedData":
          console.log(
            await wallet.request({
              type: "wallet_signTypedData",
              params: { domain: {}, types: {}, message: {} },
            }),
          )
          break
        case "wallet_supportedSpecs":
          console.log(await wallet.request({ type: "wallet_supportedSpecs" }))
          break
        case "wallet_supportedWalletApi":
          console.log(
            await wallet.request({ type: "wallet_supportedWalletApi" }),
          )
          break
        default:
          console.log("Method not implemented yet")
      }
    } catch (error) {
      console.error(`Error executing ${method}:`, error)
    }
  }

  return (
    <div className="App">
      <h1>StarkNet Integration Testing</h1>
      <div className="card">
        {/* Conditionally render Connect/Disconnect buttons */}
        {wallet ? (
          <button
            className="btn"
            onClick={() => handleDisconnect({ clearLastWallet: true })}>
            Disconnect
          </button>
        ) : (
          <button className="btn" onClick={() => handleConnect()}>
            Connect
          </button>
        )}
      </div>

      {walletName && (
        <div>
          <h2>
            Selected Wallet: <pre>{walletName}</pre>
          </h2>
          <div className="rpc-test">
            <button
              className="btn"
              onClick={() => testRPC("wallet_getPermissions")}>
              Get Permissions
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_supportedSpecs")}>
              Supported Specs
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_supportedWalletApi")}>
              Supported Wallet API Versions
            </button>
          </div>
          <div>
            <button
              className="btn"
              onClick={() => testRPC("wallet_requestAccounts")}>
              Request Accounts
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_watchAsset")}>
              Watch Asset
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_addStarknetChain")}>
              Add Starknet Chain
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_switchStarknetChain")}>
              Switch Starknet Chain
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_requestChainId")}>
              Request Chain ID
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_deploymentData")}>
              Get Deployment Data
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_addInvokeTransaction")}>
              Add Invoke Transaction
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_addDeclareTransaction")}>
              Add Declare Transaction
            </button>
            <button
              className="btn"
              onClick={() => testRPC("wallet_signTypedData")}>
              Sign Typed Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
