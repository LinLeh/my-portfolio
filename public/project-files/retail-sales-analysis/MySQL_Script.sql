-- 1. Create Database
CREATE DATABASE SuperstoreDB;
USE SuperstoreDB;

-- 2. View Imported Data
SELECT *
FROM superstore
LIMIT 10;

-- 3. Count Total Records
SELECT COUNT(*)
FROM superstore;

-- 4. Create Working Table
CREATE TABLE Orders AS
SELECT *
FROM superstore;

-- 5. Verify New Table
SELECT COUNT(*)
FROM Orders;

SELECT *
FROM Orders
LIMIT 10;

-- 6. Check Missing Values
SELECT *
FROM Orders
WHERE Sales IS NULL
OR Profit IS NULL
OR City IS NULL;

-- 7. Check Duplicate Records
SELECT
Ship_Mode,
Segment,
Country,
City,
State,
Postal_Code,
Region,
Category,
Sub_Category,
Sales,
Quantity,
Discount,
Profit,
COUNT(*) AS DuplicateCount
FROM Orders
GROUP BY
Ship_Mode,
Segment,
Country,
City,
State,
Postal_Code,
Region,
Category,
Sub_Category,
Sales,
Quantity,
Discount,
Profit
HAVING COUNT(*) > 1;

-- 8. Find Negative Profit
SELECT *
FROM Orders
WHERE Profit < 0;

-- 9. Check Blank State
SELECT *
FROM Orders
WHERE State = '';

-- Exploratory Data Analysis (EDA)
-- 10. Total Sales
SELECT SUM(Sales) AS TotalSales
FROM Orders;

-- 11. Total Profit
SELECT SUM(Profit) AS TotalProfit
FROM Orders;

-- 12. Average Sales
SELECT AVG(Sales) AS AverageSales
FROM Orders;

-- 13. Maximum Sale
SELECT MAX(Sales) AS MaximumSale
FROM Orders;

-- 14. Minimum Sale
SELECT MIN(Sales) AS MinimumSale
FROM Orders;

-- Business Analysis
-- 15. Top 10 Cities by Sales
SELECT City,
ROUND(SUM(Sales),2) AS TotalSales
FROM Orders
GROUP BY City
ORDER BY TotalSales DESC
LIMIT 10;

-- 16. Top States by Sales
SELECT State,
SUM(Sales) AS TotalSales
FROM Orders
GROUP BY State
ORDER BY TotalSales DESC;

-- 17. Region Wise Sales
SELECT Region,
ROUND(SUM(Sales),2) AS TotalSales
FROM Orders
GROUP BY Region;

-- 18. Category Wise Sales
SELECT Category,
ROUND(SUM(Sales),2) AS TotalSales
FROM Orders
GROUP BY Category;

-- 19. Sub-Category Wise Sales
SELECT Sub_Category,
SUM(Sales) 
FROM Orders
GROUP BY Sub_Category
ORDER BY SUM(Sales) DESC;

-- 20. Most Profitable Category
SELECT Category,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY Category
ORDER BY TotalProfit DESC;

-- 21. Least Profitable Category
SELECT Category,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY Category
ORDER BY TotalProfit ASC;

-- 22. Profit Margin
SELECT Category,
ROUND(SUM(Profit)/SUM(Sales)*100,2) AS ProfitMargin
FROM Orders
GROUP BY Category;

-- 23. Discount Impact
SELECT Discount,
ROUND(AVG(Profit),2) AS AvgProfit
FROM Orders
GROUP BY Discount
ORDER BY Discount;

-- 24. Segment Analysis
SELECT Segment,
SUM(Sales) AS TotalSales,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY Segment;

-- 25. Best Performing States
SELECT State,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY State
ORDER BY TotalProfit DESC
LIMIT 5;

-- 26. Worst Performing States
SELECT State,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY State
ORDER BY TotalProfit ASC
LIMIT 5;

-- 27. Top 3 Cities Using Window Function
SELECT *
FROM (
    SELECT
        City,
        SUM(Sales) AS Sales,
        RANK() OVER (ORDER BY SUM(Sales) DESC) AS RankNo
    FROM Orders
    GROUP BY City
) t
WHERE RankNo <= 3;

-- 28. Running Total of Sales
SELECT
    State,
    SUM(Sales) AS Sales,
    SUM(SUM(Sales)) OVER (ORDER BY SUM(Sales)) AS RunningSales
FROM Orders
GROUP BY State;

-- 29. Dense Rank by Profit *
SELECT
    Sub_Category,
    SUM(Profit) AS TotalProfit,
    DENSE_RANK() OVER (ORDER BY SUM(Profit) DESC) AS DenseRank
FROM Orders
GROUP BY Sub_Category;

-- 30. Create View
CREATE VIEW RegionSales AS
SELECT Region,
SUM(Sales) AS TotalSales,
SUM(Profit) AS TotalProfit
FROM Orders
GROUP BY Region;

SELECT *
FROM RegionSales;

-- 31. Stored Procedure
DELIMITER //
CREATE PROCEDURE GetRegionSales()
BEGIN
    SELECT
        Region,
        SUM(Sales) AS TotalSales,
        SUM(Profit) AS TotalProfit
    FROM Orders
    GROUP BY Region;
END //

DELIMITER ;

CALL GetRegionSales();

-- 32. Stored Procedure with Parameter
DELIMITER //

CREATE PROCEDURE StateSales(IN state_name VARCHAR(50))
BEGIN
    SELECT *
    FROM Orders
    WHERE State = state_name;
END //

DELIMITER ;

CALL StateSales('California');

-- 33. Indexes
CREATE INDEX idx_state
ON Orders(State);

CREATE INDEX idx_category
ON Orders(Category);

CREATE INDEX idx_region
ON Orders(Region);

-- 34. Common Table Expression (CTE)
WITH StateProfit AS (
    SELECT
        State,
        SUM(Profit) AS TotalProfit
    FROM Orders
    GROUP BY State
)
SELECT *
FROM StateProfit
WHERE TotalProfit > 5000
ORDER BY TotalProfit DESC;
