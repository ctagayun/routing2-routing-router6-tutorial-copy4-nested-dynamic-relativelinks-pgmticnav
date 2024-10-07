import * as React from "react";
import { Routes, Route, Outlet, NavLink, Link, useParams, useNavigate } from "react-router-dom";
import "./App.css";

const App = () => {
  const navigate = useNavigate();

  // First we will create a stateful users list using React.useState
    const [users, setUsers] = React.useState([  //initial value is a hard-coded list
      { id: '1', fullName: 'Robin Wieruch' },
      { id: '2', fullName: 'Sarah Finnley' },
      { id: '3', fullName: 'Jennifer Roussin' },
      { id: '4', fullName: 'Chito Tagayun' },
  ]);

  //Second add an Event handler for DELETE user
  const handleRemoveUser = (userId) => {
    setUsers((state) => state.filter((user) => user.id !== userId));

    //Lastly we take the user back to "Users" Component page. However, if the 
    //user would be an entity in a database, you would have to make an asynchronous request to delete it.
    navigate('/users');
  };

  return (
    <div className="App">
      <h1>Welcome to React Router!</h1>

      
      {/*{/* Using ROUTE COMPONENT AS CONTAINER for navigation.  
         Note: We will pass the Users list to User component */}          
      <Routes> 
         <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home /> } />
            <Route path="users" element={<Users users={users} />}>
                {/*Third pass the event handler as callback handler to the USER component (not USERS), we can use it there as inline handler
                   to remove the specific USER by identifier:  */}
                <Route  path=":userId/:userName" element={<User onRemoveUser={handleRemoveUser} />}
                />
           </Route>

            <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}
const NoMatch = () => {
  return (<p>There's nothing here: 404!</p>);
};

const Home = () => {
  return (
    <>
      <main style={{ padding: '1rem 0' }}>
        <h2>Welcome to the homepage!</h2>
      </main>
      <nav>
        <Link to="/about">About</Link>
      </nav>

       {/* We need the Outlet component to render a nested routes.
          we had to use the Outlet component in the parent route to render 
          the matched child route. In the this case the home route */}
      <Outlet />
    </>
  );
};


const About = () => {
  return (
    <>
    <main>
      <h2>About Page</h2>
      <p>
        That feels like an existential question, don't you
        think?
      </p>
    </main>
    <nav>
      <Link to="/home">Home</Link>
    </nav>
  </>

  );
};

// The Users component becomes a list component in React, because it 
// iterates over each user and returns JSX for it. In this case, it's a bit 
// more than a mere list, because we add a React Router's Link component 
//to the mix.

//The newest version of React Router comes with so-called RELATIVE LINKS. 
//We will examine this concept by looking at the Users component and its 
//ABSOLUTE PATH /users/${user.id} which is used for the Link component.
const Users = ({users}) => {

  return (
    <>
    <h2>Users List</h2>

    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {/*This is relative linking  see notes: routing2-routing-router6-tutorial-copy4-relative-links-in-react-router*/}
          {/*<Link to={`/users/${user.id}`}>  is NESTED ABSOLUTE PATH.  Since the Users component (e.g. /users/$) is used for the
            /users route (e.g. Link to={`/USERS/${user.id}), the Link in the Users component knows its current location and does 
            not need to create the whole top-level part of the absolute path. Instead it knows about /users and just appends the :userId as relative path to it.*/}
          <Link to={`/users/${user.id}/${user.fullName}`}> {/* Passing multiple params in the path. Then go to route in line 36 )which is nested to ROute in line 39*/}
                {user.fullName}  {/*What is this for */}
          </Link>
        </li>
      ))}
    </ul>
      {/* We need the Outlet component here to render the nested routes.
        We had to use the Outlet component in the parent route to render 
        the matched child route. 
        OUTLET in essence, in the Layout component INSERTS THE MATCHING 
        CHILD ROUTE (here: Home or Users component) of the parent route
         (here: /home route). */}
      <Outlet />
  </>
  );
};


  const User = ({ onRemoveUser }) => {

    //useParams Hook to get the respective userId (which equals :userId) from the URL:
    
    //const { userId, userName } = useParams(); //Example extracting multiple params from path
    //console.log(`useParams= ${userId}, ${userName}`);

    const { userId } = useParams(); //Example extracting from path with a single param
    console.log(`useParams= ${userId}`);
    return (
      <>
        <h2>User: {userId}</h2>
        {/*After we have passed the event handler as callback handler to the User component, we can use it there as inline handler to remove the specific user by identifier: */}
        <button type="button" className="btn btn-primary" onClick={() => onRemoveUser(userId)}>
           Remove
        </button>
        <Link to="/users">Back to Users</Link>
      </>
    );
  };


//Move all App components implementation detail (headline, navigation) 
//to layout component
const Layout = () => {
  const style = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return(
    <>
      <h2>Layout Component - Using useNavigate Hook </h2>
      <nav style={{borderBottom: 'solid 1px',  paddingBottom: '1rem', }}>
         <NavLink to="/home" style={style}>Home</NavLink>
         <NavLink to="/users" style={style}>Users</NavLink>
      </nav>

      <main style={{ padding: '1rem 0' }}>
        {/* We need the Outlet component here to render the nested routes.
        We had to use the Outlet component in the parent route to render 
        the matched child route. 
        Outlet in essence, in the Layout component inserts the matching 
        child route (defined by Link Component). 
        In this case Home or Users component) of the parent route
         (in this case the: Layout component). */}
        <Outlet />
      </main>

    </>
     
  );

}

export default App;
