import { useAuth } from 'context/auth-context';
import { UnauthenticatedApp } from 'unauthenticated-app';
import { AuthenticatedApp } from 'authenticated-app';
import './App.css';

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      {user ? <AuthenticatedApp /> : <AuthenticatedApp />}
    </div>
  );
}

export default App;
