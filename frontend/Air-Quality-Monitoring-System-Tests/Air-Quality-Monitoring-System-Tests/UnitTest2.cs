using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium;
using System;

namespace Air_Quality_Monitoring_System_Tests
{
    [TestClass]
    public class UnitTest2
    {
        [TestMethod]
        public void TestMethod2()
        {
            using (IWebDriver wdriver = new ChromeDriver())
            {
                wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/");
                wdriver.Manage().Window.Maximize();

                wdriver.FindElement(By.ClassName("text-center")).Click();
                Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block");

            }
        }
    }
}
