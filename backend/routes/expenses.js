const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { category, subCategory, amount } = req.body;
    const expense = new Expense({
      userId: req.user.userId,
      category,
      subCategory,
      amount
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get daily expenses
router.get('/daily', auth, async (req, res) => {
  try {
    const date = new Date();
    const expenses = await Expense.find({
      userId: req.user.userId,
      date: {
        $gte: startOfDay(date),
        $lte: endOfDay(date)
      }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly expenses
router.get('/weekly', auth, async (req, res) => {
  try {
    const date = new Date();
    const expenses = await Expense.find({
      userId: req.user.userId,
      date: {
        $gte: startOfWeek(date),
        $lte: endOfWeek(date)
      }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get monthly expenses
router.get('/monthly', auth, async (req, res) => {
  try {
    const date = new Date();
    const expenses = await Expense.find({
      userId: req.user.userId,
      date: {
        $gte: startOfMonth(date),
        $lte: endOfMonth(date)
      }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate report
router.get('/report/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const date = new Date();
    let startDate, endDate;

    switch (type) {
      case 'daily':
        startDate = startOfDay(date);
        endDate = endOfDay(date);
        break;
      case 'weekly':
        startDate = startOfWeek(date);
        endDate = endOfWeek(date);
        break;
      case 'monthly':
        startDate = startOfMonth(date);
        endDate = endOfMonth(date);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    const expenses = await Expense.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categorySummary = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    res.json({
      total,
      categorySummary,
      expenses
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;