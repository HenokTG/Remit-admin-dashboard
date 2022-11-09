import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';

const myContext = React.createContext();

export const useGlobalContext = () => useContext(myContext);

AppProvider.propTypes = {
  children: PropTypes.element,
};

export default function AppProvider({ children }) {
  const [profilePk, setProfilePk] = useState('*');
  const [account, setAccount] = useState({});
  const [profile, setProfile] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

   const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  return (
    <myContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        profilePk,
        setProfilePk,
        account,
        setAccount,
        profile,
        setProfile,
        loading,
        setLoading,
        summary,
        setSummary,
        isSummaryLoading,
        setIsSummaryLoading,
      }}
    >
      {children}
    </myContext.Provider>
  );
}
