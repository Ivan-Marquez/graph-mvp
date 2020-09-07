using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using DotnetReact.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace React.Sample.Webpack.CoreMvc.Controllers {
	public class GraphController : Controller {

		private string Data;

		public GraphController () {
			// TODO: temporary code to load sample data. Remove once service is in place.
			Data = System.IO.File.ReadAllText (Path.Combine (Environment.CurrentDirectory, "Data", "sample.json"));
		}

		public ActionResult Index () {
			return View (new GraphViewModel ());
		}

		[HttpGet]
		[Route ("api/graph")]
		public async Task Get () {
			Response.Headers.Add ("Content-Type", "text/event-stream");

			string message = $"data:{Data}\n\n";
			byte[] messageBytes = ASCIIEncoding.ASCII.GetBytes (message);

			await Response.Body.WriteAsync (messageBytes, 0, messageBytes.Length);
			await Response.Body.FlushAsync ();
		}
	}
}