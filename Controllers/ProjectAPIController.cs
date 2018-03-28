using AngularKanban.DBContext;
using System.Data.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AngularKanban.Controllers
{
    public class ProjectAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(KanbanDB.projects.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]projects value)
        {
            KanbanDB.projects.Add(value);
            return ToJson(KanbanDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]projects value)
        {
            KanbanDB.Entry(value).State = EntityState.Modified;
            return ToJson(KanbanDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            KanbanDB.projects.Remove(KanbanDB.projects.FirstOrDefault(x => x.Id == id));
            return ToJson(KanbanDB.SaveChanges());
        }
    }
}
