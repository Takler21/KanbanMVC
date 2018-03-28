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
    public class CardsAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(KanbanDB.cards.AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]cards value)
        {
            KanbanDB.cards.Add(value);
            return ToJson(KanbanDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]cards value)
        {
            KanbanDB.Entry(value).State = EntityState.Modified;
            return ToJson(KanbanDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            KanbanDB.cards.Remove(KanbanDB.cards.FirstOrDefault(x => x.Id == id));
            return ToJson(KanbanDB.SaveChanges());
        }
    }
}
