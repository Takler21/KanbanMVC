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
       public class SubcardlistAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(KanbanDB.subcardlist.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]subcardlist value)
        {
            KanbanDB.subcardlist.Add(value);
            return ToJson(KanbanDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]subcardlist value)
        {
            KanbanDB.Entry(value).State = EntityState.Modified;
            return ToJson(KanbanDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            KanbanDB.subcardlist.Remove(KanbanDB.subcardlist.FirstOrDefault(x => x.Id == id));
            return ToJson(KanbanDB.SaveChanges());
        }
    }
}
