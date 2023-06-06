import { EthProvider } from "./contexts/EthContext";
import Formdelegation from "./components/Formdelegation"
import Begin from "./components/Begin"

function App() {
  return (
    <EthProvider>
      <Begin />
      <Formdelegation />
    </EthProvider>
  );
}

export default App;
