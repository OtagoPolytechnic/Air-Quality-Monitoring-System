using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using System;

namespace Air_Quality_Monitoring_System_Tests
{
    [TestClass]
    public class LoginTest
    {
        [TestMethod]
        public void ValidLogin()
        {
            using (IWebDriver wdriver = new ChromeDriver())
            {
                wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/login");
                wdriver.Manage().Window.Maximize();

                IWebElement usernameField = wdriver.FindElement(By.Id("username")); // Replace with real ID
                IWebElement passwordField = wdriver.FindElement(By.Id("password")); // Replace with real ID
                IWebElement loginButton = wdriver.FindElement(By.CssSelector("button[type='submit']"));

                usernameField.SendKeys("your-username");
                passwordField.SendKeys("your-password");

                loginButton.Click();

                System.Threading.Thread.Sleep(2000);

                Assert.IsTrue(wdriver.Url.Contains("/D-Block"));
            }
        }
    }
}
