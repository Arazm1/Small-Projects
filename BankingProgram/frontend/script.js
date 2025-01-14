//Main-screen buttons
const balance = document.getElementById('balance');
const depositPageBtn = document.getElementById('deposit');
const withdrawPageBtn = document.getElementById('withdraw');

const depositInput = document.getElementById('deposit-amount');
const withdrawInput = document.getElementById('withdraw-amount');

//Containers
const mainScreen = document.getElementById('main-screen');
const balanceContainer = document.getElementById('balance-container');
const depositContainer = document.getElementById('deposit-container');
const withdrawContainer = document.getElementById('withdraw-container');

//Balance
const currentBalance = document.getElementById('current-balance');

//Deposit
const depositSubmit = document.getElementById('deposit-submit');
const amountDeposited = document.getElementById('amount-deposited');

//Withdraw
const withdrawSubmit = document.getElementById('withdraw-submit');
const amountWithdrawn = document.getElementById('amount-withdrawn');

//General buttons
const homeButton = document.getElementById('home-button');
const backButtons = document.querySelectorAll('.back-button');




balance.addEventListener('click', (event) => {
    event.preventDefault()
    mainScreen.style.display = 'none';
    balanceContainer.style.display = 'flex';

    async function getBalance() {
        try {
            const response = await fetch('http://127.0.0.1:3000/balance')


            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error: ", errorData.error)
                return;
            }

            const data = await response.json()
            console.log("Server: ", data)
            currentBalance.textContent = `Current Balance: $${data.balance}`;
            return;
        } catch (error) {
            console.log("Error while fetching balance", error)
        } }




        getBalance()
    });

depositPageBtn.addEventListener('click', (event) => {
    event.preventDefault()
    mainScreen.style.display = 'none';
    depositContainer.style.display = 'flex';

});


depositSubmit.addEventListener('click', async (event) => {
    event.preventDefault();
    const deposit = parseFloat(depositInput.value);
    console.log(depositInput)
    console.log(deposit)
    if (isNaN(deposit) || deposit <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({amount: deposit}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error: ", errorData.error)
            return;
        }

        amountDeposited.textContent = `Deposited: $${deposit}`;
        depositInput.value = '';

    } catch (error) {
        console.error("Error:", error);
    }
});








withdrawPageBtn.addEventListener('click', (event) => {
    event.preventDefault()
    mainScreen.style.display = 'none';
    withdrawContainer.style.display = 'flex';
});


withdrawSubmit.addEventListener('click', async (event) => {
    event.preventDefault();
    const withdraw =parseFloat(withdrawInput.value);
    if (isNaN(withdraw) || withdraw <= 0) {
        alert("Please enter a valid withdraw amount.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({amount: withdraw}),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error: ", errorData.error)
            return;
        }
        amountWithdrawn.textContent = `Withdrawn: $${withdraw}`;
        withdrawInput.value = '';

    } catch (error) {
        console.error("Error:", error);
    }
});


homeButton.addEventListener('click', (event) => {
    event.preventDefault();
    depositContainer.style.display = 'none';
    withdrawContainer.style.display = 'none';
    balanceContainer.style.display = 'none';
    mainScreen.style.display = 'flex';

});


backButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        depositContainer.style.display = 'none';
        withdrawContainer.style.display = 'none';
        balanceContainer.style.display = 'none';
        mainScreen.style.display = 'flex';
    });
});

homeButton.addEventListener('click', (event) => {
    event.preventDefault();
    depositContainer.style.display = 'none';
    withdrawContainer.style.display = 'none';
    balanceContainer.style.display = 'none';
    mainScreen.style.display = 'flex';

});
