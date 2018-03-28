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
    public class TasksAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(KanbanDB.tasks.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]tasks value)
        {
            KanbanDB.tasks.Add(value);
            return ToJson(KanbanDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]tasks value)
        {
            KanbanDB.Entry(value).State = EntityState.Modified;
            return ToJson(KanbanDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            KanbanDB.tasks.Remove(KanbanDB.tasks.FirstOrDefault(x => x.Id == id));
            return ToJson(KanbanDB.SaveChanges());
        }
    }
}
