using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using System;
using System.Threading;
using OpenQA.Selenium.Support.UI;

namespace Air_Quality_Monitoring_System_Tests
{
    [TestClass]
    public class LogoutTest
    {
        [TestMethod]
        public void TestLogout()
        {
            using (IWebDriver wdriver = new ChromeDriver())
            {
                // Navigate to login page
                wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/login");
                wdriver.Manage().Window.Maximize();

                // Log in
                wdriver.FindElement(By.XPath("//*[@id='email']")).SendKeys("co2-admin@bit.co.nz");
                wdriver.FindElement(By.XPath("//*[@id='pwd']")).SendKeys("Hello2u!");
                wdriver.FindElement(By.XPath("//*[@id='root']/div/div/div/div[2]/form/button")).Click();

                WebDriverWait wait = new WebDriverWait(wdriver, TimeSpan.FromSeconds(10));

                // Wait for login confirmation modal
                wait.Until(driver => driver.FindElement(By.XPath("//*[@id='modal-title']")));

                // Wait for logout confirmation modal to appear
                IWebElement loginOkButton = wait.Until(driver => driver.FindElement(By.XPath(" //*[@id=\"ok-btn\"]")));

                // Click OK on the logout confirmation modal
                loginOkButton.Click();

                // Click logout from navbar
                wait.Until(driver => driver.FindElement(By.XPath("//*[@id='root']/div/nav/header/ul/li[4]/a"))).Click();

                // Click logout button
                wait.Until(driver => driver.FindElement(By.XPath("//*[@id=\"root\"]/div/div/form/button"))).Click();

                IWebElement navLogin = wait.Until(driver => driver.FindElement(By.XPath("//*[@id='root']/div/nav/header/ul/li[2]/a")));
                // Assert that the login link is visible in the navbar
                Assert.IsTrue(navLogin.Displayed, "Login");
            }
        }
    }
}
