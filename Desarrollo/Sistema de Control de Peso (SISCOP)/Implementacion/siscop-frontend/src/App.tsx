import SiscopRoutes from './routes/SISCOP-ROUTES';
import { SiscopAuthProvider } from './context/SISCOP-AUTH';

function App() {
    return (
        <SiscopAuthProvider>
            <SiscopRoutes />
        </SiscopAuthProvider>
    );
}

export default App;