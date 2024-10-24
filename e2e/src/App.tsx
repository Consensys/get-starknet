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
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(null)
  const [result, setResult] = useState<string | boolean>("") // State to hold the result for display

  async function handleConnect(options?: ConnectOptions) {
    const selectedWalletSWO = await connect(options)

    if (selectedWalletSWO) {
      const myFrontendProviderUrl =
        "https://free-rpc.nethermind.io/sepolia-juno/v0_7"
      const myWalletAccount = new WalletAccount(
        { nodeUrl: myFrontendProviderUrl },
        selectedWalletSWO,
      )
      setWalletAccount(myWalletAccount)
      setWallet(selectedWalletSWO)
    }

    setWalletName(selectedWalletSWO?.name || "")
  }

  async function handleDisconnect(options?: DisconnectOptions) {
    await disconnect(options)
    setWalletName("")
    setWallet(null)
    setResult("") // Clear result on disconnect
  }

  const methods = [
    {
      name: "wallet_watchAsset",
      label: "Watch Asset",
      accountWallet: async () => {
        if (walletAccount) {
          try {
            const response = await walletAccount.watchAsset({
              type: "ERC20",
              options: {
                address:
                  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
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
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_switchStarknetChain",
      label: "Switch Starknet Chain",
      accountWallet: async () => {
        if (walletAccount) {
          try {
            const response = await walletAccount.switchStarknetChain(
              constants.StarknetChainId.SN_SEPOLIA,
            )
            setResult(response) // Display plain text
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_switchStarknetChain",
              params: { chainId: constants.StarknetChainId.SN_SEPOLIA },
            })
            setResult(response) // Display plain text
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_requestChainId",
      label: "Request Chain ID",
      accountWallet: async () => {
        if (walletAccount) {
          try {
            const response = await walletAccount.getChainId()
            setResult(response) // Display plain text
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_requestChainId",
            })
            setResult(response) // Display plain text
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_requestAccounts",
      label: "Request Accounts",
      accountWallet: null, // Not available for accountWallet
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_requestAccounts",
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_addStarknetChain",
      label: "Add Starknet Chain",
      accountWallet: null, // Not implemented
      rpc: null, // Not implemented
    },
    {
      name: "wallet_deploymentData",
      label: "Get Deployment Data",
      accountWallet: null, // Not available for accountWallet
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_deploymentData",
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_addInvokeTransaction",
      label: "Add Invoke Transaction",
      accountWallet: null, // Not implemented
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_addInvokeTransaction",
              params: {
                /* invoke transaction params */
              },
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_addDeclareTransaction",
      label: "Add Declare Transaction",
      accountWallet: null, // Not implemented
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_addDeclareTransaction",
              params: {
                /* declare transaction params */
              },
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_signTypedData",
      label: "Sign Typed Data",
      accountWallet: null, // Not implemented
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_signTypedData",
              params: { domain: {}, types: {}, message: {} },
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_getPermissions",
      label: "Get Permissions",
      accountWallet: null, // Not available for accountWallet
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_getPermissions",
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_supportedSpecs",
      label: "Supported Specs",
      accountWallet: null, // Not available for accountWallet
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_supportedSpecs",
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
    {
      name: "wallet_supportedWalletApi",
      label: "Supported Wallet API Versions",
      accountWallet: null, // Not available for accountWallet
      rpc: async () => {
        if (wallet) {
          try {
            const response = await wallet.request({
              type: "wallet_supportedWalletApi",
            })
            setResult(JSON.stringify(response, null, 2)) // Format as JSON
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
    },
  ]

  return (
    <div className="App">
      <h1>StarkNet Integration Testing</h1>
      <div className="main-content">
        <div className="card">
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

        <div className="result-box">
          <h2>Result Box</h2>
          <pre>{result || "No results yet"}</pre>
        </div>
      </div>

      {walletName && (
        <div>
          <h2>
            Selected Wallet: <pre>{walletName}</pre>
          </h2>
          <div className="method-table">
            <div className="table-header">
              <span>Method Name</span>
              <span>Account</span>
              <span>RPC</span>
            </div>
            {methods.map(({ name, label, accountWallet, rpc }) => (
              <div key={name} className="method-row">
                <span className="method-name">{label}</span>
                <button
                  className={`btn ${!accountWallet ? "btn-disabled" : ""}`}
                  onClick={() => accountWallet && accountWallet()}
                  disabled={!accountWallet}>
                  {accountWallet ? "Test" : "Not Implemented"}
                </button>
                <button
                  className={`btn ${!rpc ? "btn-disabled" : ""}`}
                  onClick={() => rpc && rpc()}
                  disabled={!rpc}>
                  {rpc ? "Test" : "Not Implemented"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
