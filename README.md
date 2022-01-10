This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

##Requirements
 - Node version 10.20 or greater. 
 - On platforms other than Windows and Linux x64, you must also install the MQ client package

## Instalation

- Install Python 2.7 (v3.x.x is not supported), and run npm config set python python2.7
```bash
npm config set python python2.7
npm install
```
## Getting Started

- In the root project directory create a local environment Next.js file: `.env.local`
- In the `.env.local` file, add the name of the local queue manager:

```bash
QUEUE_MANAGER=QMGR_NAME
```

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see PutMessage page


## Purpose

The purpose of this App is to facilitate the process of writing messages with payload and metadata (MQRFH2/usr) into a queue.  
This is not a straightforward process with the current IBM tools.  
For more advanced features (like modifying MQMD fields) please use other tools. See https://github.com/ibm-messaging/mq-rfhutil for more information.

This App was built to only run locally on development mode.

## Future work

 - Add the possibility to connect to a remote Queue Manager
 - Editing MQMD Fields
 - Load/Browse Messages from a queue

