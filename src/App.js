import { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ProTip from './ProTip';
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableContainer from '@mui/material/TableContainer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function VehicleList(props) {

  if (props.error) {
    return <div>Error: {props.error.message}</div>;
  } else if (!props.isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>VIN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell>{item.make}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.vin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}



function buildUrl(searchParams) {
  let url = "https://61fd98fca58a4e00173c95f7.mockapi.io/api/vehicles"
  if (searchParams) {
    if (searchParams.get("search")) {
      url += "/?search=" + searchParams.get("search");
    }
  }
  return url
}

function LandingPage() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(buildUrl(searchParams))
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [searchParams])

  let handleEnter = (e) => {
    if (e.code === "Enter") {
      setSearchParams({search: e.target.value})
    }
  }

  return (
    <Container maxWidth="md">
      <TextField onKeyPress={(e) => handleEnter(e)} placeholder="search..." />
      <VehicleList error={error} isLoaded={isLoaded} items={items}/>
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
