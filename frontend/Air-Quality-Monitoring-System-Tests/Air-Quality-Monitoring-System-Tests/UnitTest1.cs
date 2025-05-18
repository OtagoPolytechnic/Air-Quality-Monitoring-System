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
                wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block");
                wdriver.Manage().Window.Maximize();


                Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block");

            }
        }
        [TestClass]
        public class UnitTest3
        {
            [TestMethod]
            public void TestMethod3()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D207%20Test");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D207%20Test");

                }
            }
        }
        [TestClass]
        public class UnitTest4
        {
            [TestMethod]
            public void TestMethod4()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D201");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D201");

                }
            }
        }
        [TestClass]
        public class UnitTest5
        {
            [TestMethod]
            public void TestMethod5()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D105B");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D105B");

                }
            }
        }
        [TestClass]
        public class UnitTest6
        {
            [TestMethod]
            public void TestMethod6()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D202");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D202");

                }
            }
        }
        [TestClass]
        public class UnitTest7
        {
            [TestMethod]
            public void TestMethod7()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D313");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D313");

                }
            }
        }
        [TestClass]
        public class UnitTest8
        {
            [TestMethod]
            public void TestMethod8()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D207");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D207");

                }
            }
        }
        [TestClass]
        public class UnitTest9
        {
            [TestMethod]
            public void TestMethod9()
            {
                using (IWebDriver wdriver = new ChromeDriver())
                {
                    wdriver.Navigate().GoToUrl("https://co2-app.op-bit.nz/D-Block/D314");
                    wdriver.Manage().Window.Maximize();


                    Assert.AreEqual(wdriver.Url, "https://co2-app.op-bit.nz/D-Block/D314");

                }
            }
        }
    }
}
