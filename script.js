// script.js

let userBalance = 100; // Starting balance for testing purposes

document.getElementById('account-balance').textContent = `Balance: $${userBalance}`;

document.getElementById('place-bet-btn').addEventListener('click', function () {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    const selectedColor = document.querySelector('.bet-btn.active')?.dataset.color;

    if (!betAmount || !selectedColor) {
        alert('Please place a valid bet!');
        return;
    }

    if (betAmount > userBalance) {
        alert('You do not have enough balance to place this bet.');
        return;
    }

    // Simulate the betting process
    placeBet(betAmount, selectedColor);
});

document.querySelectorAll('.bet-btn').forEach((button) => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function placeBet(amount, color) {
    // Simulate random outcome
    const predictedColor = getRandomColor();

    const outcomeMessage = predictedColor === color ? "You win!" : "You lose!";
    const balanceChange = predictedColor === color ? amount : -amount;
    userBalance += balanceChange;

    document.getElementById('predicted-color').textContent = `Predicted Color: ${predictedColor}`;
    document.getElementById('game-outcome').textContent = outcomeMessage;
    document.getElementById('account-balance').textContent = `Balance: $${userBalance}`;
}

function getRandomColor() {
    const colors = ['red', 'blue', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
}
