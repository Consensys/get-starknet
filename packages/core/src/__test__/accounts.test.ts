import { MetaMaskAccountWrapper } from "../wallet/metamask_snap/accounts"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { Call, InvocationsSignerDetails, Provider, constants } from "starknet"
import { beforeEach, describe, expect, it, vi } from "vitest"

const starknetProvider = new Provider()

describe("MetaMaskAccountWrapper", () => {
  let metaMaskInjectedProviderMock: MetaMaskInpageProvider
  let metaMaskAccountWrapper: MetaMaskAccountWrapper

  beforeEach(() => {
    metaMaskInjectedProviderMock = {
      request: vi.fn().mockResolvedValue({
        transaction_hash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
      }),
    } as unknown as MetaMaskInpageProvider

    metaMaskAccountWrapper = new MetaMaskAccountWrapper(
      "0x1234567890ABCDEF1234567890ABCDEF12345678",
      starknetProvider,
      "0",
      metaMaskInjectedProviderMock,
      "mySnapId",
    )
  })

  it("should execute a transaction", async () => {
    const result = await metaMaskAccountWrapper.execute([
      {
        contractAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
        entrypoint: "myEntrypoint",
        calldata: [],
      },
    ])

    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledTimes(1)
    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledWith({
      method: "wallet_invokeSnap",
      params: {
        snapId: "mySnapId",
        request: {
          method: "starkNet_sendTransaction",
          params: {
            chainId: "0x534e5f474f45524c49",
            contractAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
            contractCallData: "",
            contractFuncName: "myEntrypoint",
            maxFee: null,
            senderAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
          },
        },
      },
    })

    expect(result).toEqual({
      transaction_hash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
    })
  })

  it("should sign a transaction", async () => {
    const transactions: Call[] = [
      {
        contractAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
        entrypoint: "myEntrypoint",
        calldata: [],
      },
    ]

    const transactionsDetail: InvocationsSignerDetails = {
      walletAddress:
        "0x00b28a089e7fb83debee4607b6334d687918644796b47d9e9e38ea8213833137",
      chainId: constants.StarknetChainId.SN_GOERLI,
      cairoVersion: "0",
      nonce: "0x1",
      version: "0x0",
      maxFee: 100,
    }

    const expectedSignature = {
      transaction_hash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
    }

    // Call the signTransaction function
    const result = await metaMaskAccountWrapper.signTransaction(
      transactions,
      transactionsDetail,
    )

    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledTimes(1)
    expect(metaMaskInjectedProviderMock.request).toHaveBeenCalledWith({
      method: "wallet_invokeSnap",
      params: {
        snapId: "mySnapId",
        request: {
          method: "starkNet_signMessage",
          params: {
            userAddress: "0x1234567890ABCDEF1234567890ABCDEF12345678",
            transactions,
            transactionsDetail,
            chainId: "0x534e5f474f45524c49",
          },
        },
      },
    })

    expect(result).toEqual(expectedSignature)
  })
})
