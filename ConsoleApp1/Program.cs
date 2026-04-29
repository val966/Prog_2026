using System;
using System.Collections.Generic;

namespace BadCodeTest
{
    class Program
    {
        static string s = "Hello, World!";

        static void Main(string[] args)
        {
            DoStuff();
        }

        static void DoStuff()
        {
            try
            {
                var a = 10;
                var b = 0;

                var res = a / b;

                if (a > 0)
                {
                    if (s != null)
                    {
                        if (s.Length > 0)
                        {
                            Console.WriteLine(s + " Result: " + res);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }

        private void UnusedMethod(int x, string y, double z)
        {
            var list = new List<int>();
            for (int i = 0; i < 100; i++)
            {
                list.Add(i);
            }
        }
    }
}
