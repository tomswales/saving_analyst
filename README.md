# Saving Analyst
Personal finance web app for Sparkasse Germany account transactions

<h2>Goal of the project:</h2>

I built this app to help me understand my family's monthly income and expenditure, and to run analytics to see how much we are saving and how long it will take to reach a saving goal

<b>Note: This is for people with Sparkasse Germany bank accounts. I don't know if it will work with any other accounts</b>

<h2>Cool features:</h2>

* No need for a database, all of your transaction data is stored in the browser in localStorage
* Only need to categorise each counterparty once: all transactions relating to the same account are automatically categorised with the same label
* You get a suggested category based on a machine learning algorithm
* You can see nice charts of income, expenditure, net savings and projected savings broken down by month and category
* You can choose a saving goal and see how long it will take to save up for your goal
* You can download your transaction categories. When you upload your saved file, the categories will be automatically applied

<h2>Technologies used:</h2>

React.js, Chart.js, D3.js

<h2>Installation and running:</h2>

<h3>Just use the web version</h3>

https://tomswales.github.io/saving_analyst/

<h3>Run on your own computer</h3>
<ul>
  <li>git clone https://github.com/tomswales/saving_analyst.git</li>
  <li>npm install</li>
  <li>npm start</li>
</ul>

<h2>Usage:</h2>

Note: this only works for Sparkasse Germany online banking, not tried with any other banks

<ul>
  <li>Login to Sparkasse Online-Banking</li>
  <li>Go to "Online-Banking Startseite"</li>
  <li>Go to "Umsätze" and select the account you want to analyse (if more than one)</li>
  <li>Choose transaction period start and end date (you may need to put in a TAN)</li>
  <li>Click on "Exportieren" (you may need to put in a TAN) and select "CSV-CAMT-Format"</li>
  <li>Now, in Saving Analyst, click "Click to import" and then find your csv download</li>
  <li>Your transactions should be imported into the app - now you can get started with analysis</li>
</ul>
