import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    console.log("connecting...")
    if (typeof window.ethereum !== "undefined") {
        console.log("I SEE A METAMASK!")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
        console.log("Connected!")
    } else {
        connectButton.innerHTML = "Please install Metamask"
    }
}
// get balance

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = provider.getSigner()
        // const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const txResponse = await provider.getBalance(contractAddress)

            console.log(
                `The balance of the contract is : ${ethers.utils.formatEther(
                    txResponse
                )}`
            )
        } catch (error) {
            console.log(error)
        }
    }
}

// fund
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxMine(txResponse, provider)
            console.log("DONE!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash} ...`)
    // return new Promise()

    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

// withdraw
async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            console.log("withdrawing ...")
            const transactionResponse = await contract.withdraw()
            await listenForTxMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
