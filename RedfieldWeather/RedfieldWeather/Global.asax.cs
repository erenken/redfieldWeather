﻿using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using RedfieldWeather.Common;

namespace RedfieldWeather
{
	public class WebApiApplication : System.Web.HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			GlobalConfiguration.Configure(WebApiConfig.Register);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);

			var config = GlobalConfiguration.Configuration;
			var index = config.Formatters.IndexOf(config.Formatters.JsonFormatter);
			config.Formatters[index] = new JsonMediaTypeFormatter
			{
				SerializerSettings = new JsonSerializerSettings
				{
					ContractResolver = new CamelCasePropertyNamesContractResolver()
				}
			};

			AzureStorage.SetConnectionString();
		}
	}
}
