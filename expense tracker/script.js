const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const totalAmountDisplay = document.getElementById('total-amount');
const filterCategoryInput = document.getElementById('filter-category');
const ctx = document.getElementById('expenseChart').getContext('2d');

let totalAmount = 0;
let expenses = [];
let expenseChart;

expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value.trim());
    const expenseCategory = expenseCategoryInput.value;

    if (expenseName && !isNaN(expenseAmount) && expenseCategory) {
        addExpense(expenseName, expenseAmount, expenseCategory);
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseCategoryInput.value = '';
    }
});

filterCategoryInput.addEventListener('change', function() {
    const selectedCategory = filterCategoryInput.value;
    displayExpenses(selectedCategory);
});

function addExpense(name, amount, category) {
    const expense = { name, amount, category };
    expenses.push(expense);
    displayExpenses();
    totalAmount += amount;
    updateTotal();
    updateChart();
}

function displayExpenses(filterCategory = '') {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        if (filterCategory === '' || expense.category === filterCategory) {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.name}: Rs.${expense.amount.toFixed(2)} (Category: ${expense.category})`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
                editExpense(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteExpense(index);
            });

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            expenseList.appendChild(listItem);
        }
    });
}

function editExpense(index) {
    const expense = expenses[index];
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;
    expenseCategoryInput.value = expense.category;

    deleteExpense(index);
}

function deleteExpense(index) {
    totalAmount -= expenses[index].amount;
    expenses.splice(index, 1);
    updateTotal();
    displayExpenses();
    updateChart();
}

function updateTotal() {
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
}

function updateChart() {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses by Category',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Expenses Distribution'
                }
            }
        }
    });
}