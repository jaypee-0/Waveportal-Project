// Lesson 4 - Fund the contract and send money

const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // fund the contract with 0.1 eth
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract addy:", waveContract.address);

  // Get Contract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    // Checks if the contract has a balance of 0.1eth
    hre.ethers.utils.formatEther(contractBalance)
  );

  // Send Wave
  let waveTxn = await waveContract.wave("Wave!");
  await waveTxn.wait();

  // Get Contract balance to see what happened!
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

// // Lesson 3

// const main = async () => {
//   const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
//   const waveContract = await waveContractFactory.deploy();
//   await waveContract.deployed({
//     value: hre.ethers.utils.parseEther("0.1"),
//   });
//   console.log("Contract addy:", waveContract.address);

//   let waveCount;
//   waveCount = await waveContract.getTotalWaves();
//   console.log(waveCount.toNumber());

//   // Send wave!
//   let waveTxn = await waveContract.wave("A message!");
//   await waveTxn.wait(); // Wait for the transaction to be mined

//   const [_, randomPerson] = await hre.ethers.getSigners();
//   waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
//   await waveTxn.wait(); // Wait for the transaction to be mined

//   let allWaves = await waveContract.getAllWaves();
//   console.log(allWaves);
// };

// const runMain = async () => {
//   try {
//     await main();
//     process.exit(0);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// runMain();


// Lesson 2

// const main = async () => {
//     const [owner, randomPerson] = await hre.ethers.getSigners();  //grabs the address of the person deploting the smart contract and a random address   
//     const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
//     const waveContract = await waveContractFactory.deploy();
//     await waveContract.deployed();
  
//     console.log("Contract deployed to:", waveContract.address);
//     console.log("Contract deployed by:", owner.address);
  
//     let waveCount;
//     waveCount = await waveContract.getTotalWaves();
  
//     let wavTx = await waveContract.wave();
//     await wavTx.wait();
    
//     waveCount = await waveContract.getTotalWaves();

//     wavTx = await waveContract.connect(randomPerson).wave();
//     await wavTx.wait();

//     waveCount = await waveContract.getTotalWaves();
//   };
  
//   const runMain = async () => {
//     try {
//       await main();
//       process.exit(0);
//     } catch (error) {
//       console.log(error);
//       process.exit(1);
//     }
//   };
  
//   runMain();


// Lesson 1

// const main = async () => {
//     const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");   // compiles the contract and generates files in the artifact direct...
//     const waveContract = await waveContractFactory.deploy();   // Creates a local eth network that's on a fresh blockchain
//    await waveContract.deployed();  // runs when the smart contract is deployed
//     console.log("Contract deployed to:", waveContract.address);  // displays the address of the deployed contract
//   };
  
//   const runMain = async () => {
//     try {
//       await main();
//       process.exit(0); // exit Node process without error
//     } catch (error) {
//       console.log(error);
//       process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
//     }
//     // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
//   };
  
//   runMain();