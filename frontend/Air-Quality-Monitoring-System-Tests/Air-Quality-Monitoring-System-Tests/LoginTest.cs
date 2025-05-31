using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using System;
using System.Threading;
using OpenQA.Selenium.Support.UI;

namespace Air_Quality_Monitoring_System_Tests
{
    [TestClass]
    public class LoginTest
    {
        [TestMethod]
        public void TestLogin()
        {
            using (IWebDriver wdriver = new ChromeDriver())
            {
                // Navigate to the login page
                wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/login");
                wdriver.Manage().Window.Maximize();

                // Fill in login form
                IWebElement email = wdriver.FindElement(By.XPath("//*[@id='email']"));

                IWebElement password = wdriver.FindElement(By.XPath("//*[@id='pwd']"));

                IWebElement loginButton = wdriver.FindElement(By.XPath("//*[@id='root']/div/div/div/div[2]/form/button"));

                email.SendKeys("co2-admin@bit.co.nz"); 
                password.SendKeys("Hello2u!"); 
                loginButton.Click();

                // Wait for login redirect
                Thread.Sleep(3000);

                WebDriverWait wait = new WebDriverWait(wdriver, TimeSpan.FromSeconds(10));

                // Wait for modal title to appear
                IWebElement modalTitle = wait.Until(driver =>
                    driver.FindElement(By.XPath("//*[@id='modal-title']"))
                );

                // Assert the success message
                Assert.AreEqual("Successfully logged in", modalTitle.Text);
            }
        }
    }
}
