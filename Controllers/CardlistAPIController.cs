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
    public class CardlistAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(KanbanDB.cardlist.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]cardlist value)
        {
            KanbanDB.cardlist.Add(value);
            return ToJson(KanbanDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]cardlist value)
        {
            KanbanDB.Entry(value).State = EntityState.Modified;
            return ToJson(KanbanDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            KanbanDB.cardlist.Remove(KanbanDB.cardlist.FirstOrDefault(x => x.Id == id));
            return ToJson(KanbanDB.SaveChanges());
        }
    }
}
