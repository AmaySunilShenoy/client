import logo from './logo.svg';
import './App.css';
import Home from './components/layout';
import FormCard from './components/FormCard';
import Layout from './components/layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import Form from './components/Form';

function App() {
  return (
      <Routes>
        <Route element={<Layout/>}>
        <Route path="/" element={<FormCard />} />
        <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
  );
}

export default App;
