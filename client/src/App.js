import React, { useState, useEffect } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAbi = Voting.abi;

function App() {
  const classes = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 100,
    },
    textField: {
      margin: 20,
    },
    button: {
      margin: 20,
    },
  };
  const [candidateName, setCandidateName] = useState("");
  const [candidateParty, setCandidateParty] = useState("");
  const [candidateAge, setCandidateAge] = useState("");
  const [voterName, setVoterName] = useState("");
  const [voterAge, setVoterAge] = useState("");
  const [votedCandidate, setVotedCandidate] = useState("");
  const [result, setResult] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);


  const handleStartTime = (e)=>{
    setStartTime(e.target.value);
  }

  const handleEndTime = (e)=>{
    setEndTime(e.target.value);
  }

  const handleCandidateNameChange = (e) => {
    setCandidateName(e.target.value);
  };

  const handleCandidatePartyChange = (e) => {
    setCandidateParty(e.target.value);
  };

  const handleCandidateAgeChange = (e) => {
    setCandidateAge(e.target.value);
  };

  const handleVoterNameChange = (e) => {
    setVoterName(e.target.value);
  };

  const handleVoterAgeChange = (e) => {
    setVoterAge(e.target.value);
  };

  const handleVotedCandidateChange = (e) => {
    setVotedCandidate(e.target.value);
  };

  const handleRegisterCandidate = async () => {
    // Contract call to register a candidate
    try{
      await contract.registerCandidate(candidateName,candidateParty,candidateAge);
      const arr = await contract.candidatesList();
      console.log(arr);
    }catch(error){
      console.log(error);
    }
    setCandidateName("");
    setCandidateParty("");
    setCandidateAge("");
  };

  const handleRegisterVoter = async () => {
    // Contract call to register a voter
    try{
      await contract.registerVoter(voterName,voterAge);
    }catch(error){
      console.log(error);
    }
    setVoterName("");
    setVoterAge("");
  };

  const handleStartVoting = async()=>{
    try{
      await contract.startVoting(startTime,endTime);
    }catch(error){
      console.log(error);
    }
    setStartTime("");
    setEndTime("");
  };

  const handleVote = async () => {
    // Contract call to cast a vote
    try{
      await contract.vote(votedCandidate);
      const arr = await contract.candidatesList(0);
      const arr2= await contract.candidatesList(1);
      console.log(arr,arr2);
    }catch(error){
      console.log(error);
    }
    setVotedCandidate("");

  };

  const handleDeclareResult = async () => {
    // Contract call to declare the election result
    // const result = await contractInstance.methods
    //   .declareResult()
    //   .call({ from: currentAccount });
    // setResult(result);
    try{
      await contract.declareResult();
      const arr = await contract.candidatesList(0);
      const arr2= await contract.candidatesList(1);
      console.log(arr,arr2);
      const result = await contract.result();
      console.log(result);
    }catch(error){
      console.log(error);
      return;
    }
    const result = await contract.result();
    setResult(result);
    console.log(result);
  };


  
  const connectWallet = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        console.log(contract);
        console.log(address);
        setContract(contract);
        setProvider(provider);
        console.log("Election commission:");
        const electionCommission = await contract.electionCommission();
        console.log(electionCommission);
      } else {
        console.log("Metamask is not installed");
      }
    };
    provider && loadProvider();

  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  return (

    <Container className={classes.container}>
      <div className="connect-button">
              {account ? (
                <div>
                  <Button
                    sx={{ mr: 2 }}
                    onClick={connectWallet}
                    variant="contained"
                    disabled
                  >
                    Connect
                  </Button>
                  {account}
                </div>
              ) : (
                <Button
                  sx={{ mr: 2 }}
                  onClick={connectWallet}
                  variant="contained"
                >
                  Connect
                </Button>
              )}
            </div>
          
      <Typography variant="h5">Candidate Registration</Typography>
      <TextField
        label="Name"
        value={candidateName}
        onChange={handleCandidateNameChange}
        className={classes.textField}
      />
      <TextField
        label="Party"
        value={candidateParty}
        onChange={handleCandidatePartyChange}
        className={classes.textField}
      />
      <TextField
        label="Age"
        value={candidateAge}
        onChange={handleCandidateAgeChange}
        className={classes.textField}
      />
      <Button
        variant="contained"
        onClick={handleRegisterCandidate}
        className={classes.button}
      >
        Register Candidate
      </Button>
      <Typography variant="h5">Voter Registration</Typography>
      <TextField
        label="Name"
        value={voterName}
        onChange={handleVoterNameChange}
        className={classes.textField}
      />
      <TextField
        label="Age"
        value={voterAge}
        onChange={handleVoterAgeChange}
        className={classes.textField}
      />
      <Button
        variant="contained"
        onClick={handleRegisterVoter}
        className={classes.button}
      >
        Register Voter
      </Button>

      <Typography variant="h5">Start Voting</Typography>
      <TextField
        label="Start Time"
        value={startTime}
        onChange={handleStartTime}
        className={classes.textField}
      />
      <TextField
        label="End Time"
        value={endTime}
        onChange={handleEndTime}
        className={classes.textField}
      />
      <Button
        variant="contained"
        onClick={handleStartVoting}
        className={classes.button}
      >
        Start Voting
      </Button>

      <Typography variant="h5">Voting</Typography>
      <TextField
        label="Voted Candidate"
        value={votedCandidate}
        onChange={handleVotedCandidateChange}
        className={classes.textField}
      />
      <Button
        variant="contained"
        onClick={handleVote}
        className={classes.button}
      >
        Vote
      </Button>
      <Typography variant="h5">Result Declaration</Typography>
      <Button
        variant="contained"
        onClick={handleDeclareResult}
        className={classes.button}
      >
        Declare Result
      </Button>
      {result && <Typography variant="h5">Result: {result}</Typography>}
    </Container>
  );
}

export default App;

