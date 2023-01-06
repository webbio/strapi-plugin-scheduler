import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async create(data) {
    return await strapi.entityService.create("plugin::scheduler.scheduler", {
      data,
    });
  },
  async update(id, data) {
    return await strapi.entityService.update(
      "plugin::scheduler.scheduler",
      id,
      {
        data,
      }
    );
  },
  async findOne(id) {
    return strapi.entityService.findOne("plugin::scheduler.scheduler", id);
  },
  async delete(id) {
    return await strapi.entityService.delete("plugin::scheduler.scheduler", id);
  },
  async schedule(data) {
    const existingEntries = await this.getByUidAndEntryId(
      data.uid,
      data.entryId
    );
    const existingPublishEntry = existingEntries.find(
      (entry) => entry.type === "publish"
    );
    const existingArchiveEntry = existingEntries.find(
      (entry) => entry.type === "archive"
    );

    if (existingPublishEntry) {
      await this.update(existingPublishEntry.id, {
        uid: data.uid,
        entryId: data.entryId,
        type: "publish",
        datetime: data.publishAt,
      });
    } else {
      await this.create({
        uid: data.uid,
        entryId: data.entryId,
        type: "publish",
        datetime: data.publishAt,
      });
    }

    if (existingArchiveEntry) {
      await this.update(existingArchiveEntry.id, {
        uid: data.uid,
        entryId: data.entryId,
        type: "archive",
        datetime: data.archiveAt,
      });
    } else {
      await this.create({
        uid: data.uid,
        entryId: data.entryId,
        type: "archive",
        datetime: data.archiveAt,
      });
    }
  },
  async getByUidAndEntryId(uid, entryId) {
    const result = await strapi
      .query("plugin::scheduler.scheduler")
      .findMany({ where: { uid, entryId } });

    return result;
  },
  async findItemsPastCurrentDate() {
    const currentDate = new Date();

    const result = await strapi.query("plugin::scheduler.scheduler").findMany({
      where: {
        datetime: { $lte: currentDate },
      },
    });

    return result;
  },
  async publishEntry(schedulerEntry) {
    return strapi.db.query(schedulerEntry.uid).update({
      where: {
        id: schedulerEntry.entryId,
      },
      data: {
        publishedAt: new Date(),
      },
    });
  },
  async archiveEntry(schedulerEntry) {
    return strapi.db.query(schedulerEntry.uid).update({
      where: {
        id: schedulerEntry.entryId,
      },
      data: {
        publishedAt: null,
      },
    });
  },
  async runCronTask() {
    const entries = await this.findItemsPastCurrentDate();

    for await (const entry of entries) {
      try {
        if (entry.type === "publish") {
          await this.publishEntry(entry);
        }

        if (entry.type === "archive") {
          await this.archiveEntry(entry);
        }
      } catch (error) {
        console.error("Error publishing or archiving entry:", error);
      } finally {
        await this.delete(entry.id);
      }
    }
  },
});
