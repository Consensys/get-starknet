import "./App.css"
import contractData from "./contracts/contracts_VotingContractFlo.contract_class.json"
import {
  type ConnectOptions,
  type DisconnectOptions,
  StarknetWindowObject,
  connect,
  disconnect,
} from "@starknet-io/get-starknet"
import { useEffect, useState } from "react"
import { WalletAccount, constants } from "starknet"

// adjust path as needed

type Chains = Record<string, string>

const chains: Chains = {
  [constants.StarknetChainId.SN_MAIN]: "main",
  [constants.StarknetChainId.SN_SEPOLIA]: "testnet",
}

function App() {
  const [walletName, setWalletName] = useState("")
  const [wallet, setWallet] = useState<StarknetWindowObject | null>(null)
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletChainId, setWalletChainId] = useState<string | null>(null)
  const [result, setResult] = useState<string | boolean>("")

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
      setWalletChainId(selectedWalletSWO.chainId)
      setWalletAddress(selectedWalletSWO?.selectedAddress)
      setWalletName(selectedWalletSWO?.name || "")
      // Set the wallet globally if needed
      window.wallet = myWalletAccount

      myWalletAccount.walletProvider.on("accountsChanged", (res) => {
        console.log(res)
      })
    }
  }

  async function handleDisconnect(options?: DisconnectOptions) {
    await disconnect(options)
    setWalletName("")
    setWallet(null)
    setWalletAddress(null)
    setWalletAccount(null)
    setWalletChainId(null)
    setResult("")
  }

  const tokenToWatch = {
    type: "ERC20",
    options: {
      address:
        "0x044e6bcc627e6201ce09f781d1aae44ea4c21c2fdef299e34fce55bef2d02210",
      name: "Lords",
      symbol: "LORDS",
      decimals: 18,
    },
  }

  useEffect(() => {
    if (!walletAccount) return

    const handleNetworkChange = (chainId: any, accounts: any) => {
      setWalletAddress(accounts[0])
      setWalletChainId(chainId)
    }

    const handleAccountChange = (accounts: any) => {
      setWalletAddress(accounts[0])
    }

    walletAccount.onNetworkChanged(handleNetworkChange)
    walletAccount.onAccountChange(handleAccountChange)

    // Manual cleanup strategy: reset listeners on new `walletAccount`
    return () => {
      walletAccount.onNetworkChanged(() => {}) // Replaces the listener with a no-op
      walletAccount.onAccountChange(() => {}) // Replaces the listener with a no-op
    }
  }, [walletAccount])

  const methods = [
    {
      name: "wallet_watchAsset",
      label: "Watch Asset",
      accountWallet: async () => {
        if (walletAccount) {
          try {
            const response = await walletAccount.watchAsset(tokenToWatch as any)
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
              params: tokenToWatch as any,
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
            const targetChainId =
              walletChainId === constants.StarknetChainId.SN_SEPOLIA
                ? constants.StarknetChainId.SN_MAIN
                : constants.StarknetChainId.SN_SEPOLIA

            const response = await walletAccount.switchStarknetChain(
              targetChainId,
            )
            setResult(response) // Display plain text
            setWalletChainId(targetChainId) // Update the local state
            const accounts = await walletAccount?.requestAccounts()
            if (accounts) {
              setWalletAddress(accounts[0])
            }
          } catch (error: any) {
            console.log(error)
            setResult(`Error: ${error.message}`)
          }
        }
      },
      rpc: async () => {
        if (wallet) {
          try {
            const targetChainId =
              walletChainId === constants.StarknetChainId.SN_SEPOLIA
                ? constants.StarknetChainId.SN_MAIN
                : constants.StarknetChainId.SN_SEPOLIA

            const response = await wallet.request({
              type: "wallet_switchStarknetChain",
              params: { chainId: targetChainId },
            })
            setResult(response) // Display plain text
            setWalletChainId(targetChainId) // Update the local state
            const accounts = await walletAccount?.requestAccounts()
            if (accounts) {
              setWalletAddress(accounts[0])
            }
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
            setWalletAddress(response[0])
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
        if (wallet && walletAddress) {
          try {
            const response = await wallet.request({
              type: "wallet_addInvokeTransaction",
              params: {
                calls: [
                  {
                    contract_address:
                      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                    entry_point: "transfer",
                    calldata: [walletAddress, "1000000000000000", "0"],
                  },
                ],
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
          const compiled_class_hash =
            "0x07ea1256c6bb9ff94fc375cfcabf0df588510f1d27895e726db46b7a407e9140"
          const contract_class = contractData
          try {
            const response = await wallet.request({
              type: "wallet_addDeclareTransaction",
              params: {
                contract_class: contract_class as any,
                compiled_class_hash,
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
              params: {
                types: {
                  StarkNetDomain: [
                    { name: "name", type: "felt" },
                    { name: "version", type: "felt" },
                    { name: "chainId", type: "felt" },
                  ],
                  Person: [
                    { name: "name", type: "felt" },
                    { name: "wallet", type: "felt" },
                  ],
                  Mail: [
                    { name: "from", type: "Person" },
                    { name: "to", type: "Person" },
                    { name: "contents", type: "felt" },
                  ],
                },
                primaryType: "Mail",
                domain: {
                  name: "Starknet Mail",
                  version: "1",
                  chainId: 1,
                },
                message: {
                  from: {
                    name: "Cow",
                    wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
                  },
                  to: {
                    name: "Bob",
                    wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                  },
                  contents: "Hello, Bob!",
                },
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

      {walletName && walletChainId && (
        <div>
          <h4>
            <pre>Wallet: {walletName}</pre>
            <pre>Chain: {chains[walletChainId]}</pre>
            <pre>Address: {walletAddress}</pre>
          </h4>
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
