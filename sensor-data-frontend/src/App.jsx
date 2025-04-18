import SensorForm from "./components/SensorForm";
import SensorDataViewer from "./components/SensorDataViewer";
import MetaMaskConnect from "./components/MetaMaskConnect";
import SensorFormWithMetaMask from "./components/SensorFormWithMetamask";
function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sensor Data DApp</h1>
      {/* <SensorForm /> */}
      <MetaMaskConnect />
      <SensorFormWithMetaMask />
      <hr />
      <SensorDataViewer />
    </div>
  );
}

export default App;
