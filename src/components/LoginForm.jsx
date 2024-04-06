import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error("Error signing in with password and email", error.message);
      // add error handling/display here
    }
  };

  return (
    <div className="flex flex-col items-center sm:justify-center min-h-screen pt-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
        <div className="flex flex-col items-center">
          <img src="/DD-logo.PNG" alt="DualDesk" className="w-20 h-20" />
          <h2 className="card-title">Welcome to Dual Desk</h2>
        </div>
          <form onSubmit={login}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Your email</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered"
                placeholder="name@email.com"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered"
                placeholder="••••••••"
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
