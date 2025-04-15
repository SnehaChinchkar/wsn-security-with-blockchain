import SensorForm from "./components/SensorForm";
import SensorDataViewer from "./components/SensorDataViewer";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sensor Data DApp</h1>
      <SensorForm />
      <hr />
      <SensorDataViewer />
    </div>
  );
}

export default App;
