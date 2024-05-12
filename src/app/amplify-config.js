"use client"
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
Amplify.configure(config, { ssr: true });

export const client = generateClient();

export default function RootLayoutThatConfiguresAmplifyOnTheClient({ children }) {
  return children;
}