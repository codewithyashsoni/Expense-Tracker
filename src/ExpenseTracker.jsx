import React, { useState, useEffect } from "react"
import { LuTrash2 } from "react-icons/lu"

function ExpenseTracker(){
    const[transactions, setTransactions] = useState(() => {
        const savedTransactions = localStorage.getItem("transactions");
        if(savedTransactions){
            return JSON.parse(savedTransactions);
        }
        return []
    });
    const[description, setDescription] = useState("");
    const[amount, setAmount] = useState("");
    const[category, setCategory] = useState("Food");
    const[type, setType] = useState("Expense");
    const[date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const[filter, setFilter] = useState("All");

    const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Salary",
    "Other"
    ];

    const filters=[
    "All",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Salary",
    "Other"
    ];

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const calculateTotals = (transactionsArray) =>{
        let balance = 0;
        let income = 0;
        let expense = 0;
        for(let transaction of transactionsArray){
            if(transaction.type === "Expense"){
                expense += transaction.amount;
            }else{
                income += transaction.amount;
            }
        }
        balance = income - expense;
        return{
            balance,
            income,
            expense
        }
    }

    const totals = calculateTotals(transactions);

    function handleAddTransaction(e){
        e.preventDefault();
        if(description.trim() === "" || amount <= 0){
            return;
        }
        const newTransaction = {
            id: Date.now(),
            description: description,
            amount :Number(amount),
            category :category,
            type: type,
            date: date
        }
        
        setTransactions(t => [...t, newTransaction]);

        setDescription("");
        setAmount("");
        setCategory("Food");
        setType("Expense");
        setDate(new Date().toISOString().slice(0, 10));
    
    }

    function handleDelete(id){
        setTransactions(prevTransactions => prevTransactions.filter((transaction) => transaction.id !== id));
    }
    
    return(
        <div className="container">
            <h1>Expense Tracker</h1>
            <div className="card-container">
                <div className="card">
                <p className="card-name">Balance</p>
                <p className="card-value">₹{totals.balance.toLocaleString("en-IN")}</p>
                </div>
                <div className="card">
                <p className="card-name">Income</p>
                <p className="card-value green">₹{totals.income.toLocaleString("en-IN")}</p>
                </div>
                <div className="card">
                <p className="card-name">Expense</p>
                <p className="card-value red">₹{totals.expense.toLocaleString("en-IN")}</p>
                </div>
            </div>

            <form onSubmit={handleAddTransaction}>
                <div className="form-row row-1">
                    <input 
                        type="text" 
                        className="description" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        className="amount" 
                        placeholder="Amount" 
                        value={amount}
                        min={1} 
                        onChange={(e) => setAmount(e.target.value)} 
                    />
                </div>
                <div className="form-row row-2">
                    <select 
                        className="transaction-category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select 
                        className="transaction-type" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Expense">Expense</option>
                        <option value="Income">Income</option>
                    </select>
                    <input 
                        type="date" 
                        className="date"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                    <button className="add-button" type="submit">ADD</button>
                </div>
            </form>
    
            <div className="transactions-container">
                {
                    transactions.length === 0 ? 
                        (<p className="empty-message">No transactions yet</p>)
                        :
                        (<div>
                            <div className="filter-buttons-container">
                                {filters.map((f) => (
                                    <button 
                                        key={f}
                                        type="button"
                                        className={`filter-button ${filter === f ? "active-filter" : ""}`}
                                        onClick={() => setFilter(f)}
                                    >{f}</button>
                                ))}
                            </div>

                            <ul className="transactions-list">
                                {(filter === "All" ? transactions : transactions.filter((transaction) => transaction.category === filter))
                                .map((transaction) => 
                                <li key={transaction.id}>
                                    <div className="transaction-left-div">
                                        <span className="transaction-description">
                                            {transaction.description}
                                        </span>
                                    
                                        <span>{transaction.category} • {new Date(transaction.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric"
                                        })}</span>
                                    </div>

                                    <div className="transaction-right-div">
                                        <span className={`transaction-amount ${transaction.type === "Expense" ? "red" : "green"}` }>
                                            {(transaction.type === "Expense" ? "-" : "+")+ "₹" +transaction.amount.toLocaleString("en-IN")}
                                        </span>

                                        <button 
                                            className="delete-btn" 
                                            type="button"
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            <LuTrash2 />
                                        </button>
                                    </div>
                                </li>)}
                            </ul>
                        </div>
                        )
                }
            </div>
        </div>
      )
}

export default ExpenseTracker