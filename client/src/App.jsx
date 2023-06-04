import { EthProvider } from "./contexts/EthContext";
import Formdelegation from "./components/Formdelegation"

function App() {
  return (
    <EthProvider>
         <Formdelegation />
    </EthProvider>
  );
}

export default App;
