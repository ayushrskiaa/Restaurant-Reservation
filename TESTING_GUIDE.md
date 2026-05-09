# Testing Guide

This document provides templates and guidelines for adding tests to the project.

---

## 🎯 Testing Strategy

### Test Pyramid
```
       E2E Tests (10%)
     Integration (30%)
   Unit Tests (60%)
```

### Current Status
- ❌ Unit Tests: 0%
- ❌ Integration Tests: 0%
- ❌ E2E Tests: 0%
- **Coverage Goal:** 70%+

---

## 🧪 Backend Testing (Jest)

### Setup

```bash
cd backend
npm install --save-dev jest supertest
npx jest --init
```

### Jest Configuration (`backend/jest.config.js`)

```javascript
export default {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
};
```

### Example Test: Reservation Controller

**File:** `backend/__tests__/controller/reservation.test.js`

```javascript
import request from "supertest";
import app from "../../app.js";
import { Reservation } from "../../models/reservation.js";

// Mock the Reservation model
jest.mock("../../models/reservation.js");

describe("Reservation Controller", () => {
  describe("POST /api/v1/reservation", () => {
    it("should create a reservation with valid data", async () => {
      const reservationData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+92-3001234567",
        date: "2024-12-25",
        time: "19:30",
        guests: 4,
      };

      Reservation.create.mockResolvedValue({
        _id: "123",
        ...reservationData,
      });

      const response = await request(app)
        .post("/api/v1/reservation")
        .send(reservationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Reservation Sent Successfully!");
    });

    it("should reject with invalid email", async () => {
      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        phone: "+92-3001234567",
        date: "2024-12-25",
        time: "19:30",
        guests: 4,
      };

      const response = await request(app)
        .post("/api/v1/reservation")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
    });

    it("should reject past dates", async () => {
      const pastDateData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+92-3001234567",
        date: "2020-01-01",
        time: "19:30",
        guests: 4,
      };

      const response = await request(app)
        .post("/api/v1/reservation")
        .send(pastDateData)
        .expect(400);

      expect(response.body.message).toContain("future");
    });

    it("should reject missing required fields", async () => {
      const incompleteData = {
        firstName: "John",
        // lastName missing
        email: "john@example.com",
      };

      const response = await request(app)
        .post("/api/v1/reservation")
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBeFalsy();
    });
  });
});
```

### Run Backend Tests

```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # With coverage report
npm test reservation      # Run specific test
```

---

## ⚛️ Frontend Testing (Vitest)

### Setup

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Vitest Configuration (`frontend/vite.config.js`)

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.js",
  },
});
```

### Example Test: Reservation Component

**File:** `frontend/src/__tests__/components/Reservation.test.jsx`

```javascript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reservation from "../../components/Reservation";
import { describe, it, expect, vi } from "vitest";

describe("Reservation Component", () => {
  it("renders reservation form", () => {
    render(<Reservation />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    const mockSubmit = vi.fn();
    
    render(<Reservation onSubmit={mockSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/first name/i), "John");
    await userEvent.type(screen.getByLabelText(/last name/i), "Doe");
    await userEvent.type(screen.getByLabelText(/email/i), "john@example.com");
    
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<Reservation />);
    
    await userEvent.type(screen.getByLabelText(/email/i), "invalid");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });
});
```

### Run Frontend Tests

```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --ui          # UI mode
npm test -- --coverage    # Coverage report
```

---

## 🎬 E2E Testing (Cypress)

### Setup

```bash
npm install --save-dev cypress
npx cypress open
```

### Example E2E Test

**File:** `cypress/e2e/reservation.cy.js`

```javascript
describe("Restaurant Reservation Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should complete a reservation", () => {
    // Navigate to reservation page
    cy.contains("Make a Reservation").click();
    
    // Fill form
    cy.get('[name="firstName"]').type("John");
    cy.get('[name="lastName"]').type("Doe");
    cy.get('[name="email"]').type("john@example.com");
    cy.get('[name="phone"]').type("+92-3001234567");
    cy.get('[name="date"]').type("2024-12-25");
    cy.get('[name="time"]').type("19:30");
    cy.get('[name="guests"]').select("4");
    
    // Submit
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.contains("Reservation Sent Successfully!").should("be.visible");
  });

  it("should show validation error for invalid email", () => {
    cy.contains("Make a Reservation").click();
    
    cy.get('[name="firstName"]').type("John");
    cy.get('[name="lastName"]').type("Doe");
    cy.get('[name="email"]').type("invalid-email");
    
    cy.get('button[type="submit"]').click();
    
    cy.contains("valid email").should("be.visible");
  });
});
```

---

## 📊 Coverage Reporting

### Generate Coverage Report

```bash
# Backend
cd backend
npm test -- --coverage

# Frontend
cd frontend
npm test -- --coverage
```

### Coverage Thresholds

Set in `package.json`:

```json
{
  "jest": {
    "collectCoverageFrom": [
      "controller/**/*.js",
      "models/**/*.js",
      "middlewares/**/*.js",
      "!**/*.test.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

---

## 🔄 CI/CD Testing

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run backend tests
        run: |
          cd backend
          npm test -- --coverage
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## ✅ Testing Checklist

- [ ] Unit tests for all controllers
- [ ] Unit tests for models/schemas
- [ ] Unit tests for middlewares
- [ ] Integration tests for API endpoints
- [ ] Component tests for main React components
- [ ] E2E tests for critical user flows
- [ ] Achieve 70%+ code coverage
- [ ] All tests passing in CI/CD
- [ ] Performance tests for API endpoints
- [ ] Security tests (OWASP ZAP)

---

## 📚 Testing Best Practices

1. **Arrange-Act-Assert Pattern**
```javascript
it("should...", () => {
  // Arrange
  const data = { ... };
  
  // Act
  const result = functionUnderTest(data);
  
  // Assert
  expect(result).toBe(...);
});
```

2. **One assertion per test** (when possible)
3. **Descriptive test names**
4. **Mock external dependencies**
5. **Use fixtures for test data**
6. **Test error cases, not just happy path**

---

## 🚀 Getting Started

1. **Install Jest/Vitest**
2. **Write tests for reservation controller**
3. **Achieve 50% coverage**
4. **Add GitHub Actions workflow**
5. **Gradually increase coverage to 70%+**

---

**Priority:** After authentication implementation
**Estimated Effort:** 12-16 hours
