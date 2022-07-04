import { Router, Request, Response } from "express";
import {
	Role,
	getPermission,
	Member,
	GuildRoleCreateEvent,
	GuildRoleUpdateEvent,
	GuildRoleDeleteEvent,
	emitEvent,
	Config,
	DiscordApiErrors,
	handleFile
} from "@fosscord/util";
import { route } from "@fosscord/api";
import {RoleModifySchema, RolePositionUpdateSchema} from '../'

const router = Router();

router.get("/",route({}), async (req: Request, res: Response) => {
    const { guild_id, role_id } = req.params
    await Member.IsInGuildOrFail(req.user_id, guild_id);
	const role = await Role.find({ guild_id: guild_id }).find((r: {id: string}) => r.id === role_id);
	return res.json(role);
});

// router.post("/", route({ body: "RoleModifySchema", permission: "MANAGE_ROLES" }), async (req: Request, res: Response) => {
// 	const guild_id = req.params.guild_id;
// 	const body = req.body as RoleModifySchema;

// 	const role_count = await Role.count({ guild_id });
// 	const { maxRoles } = Config.get().limits.guild;

// 	if (role_count > maxRoles) throw DiscordApiErrors.MAXIMUM_ROLES.withParams(maxRoles);

// 	const role = new Role({
// 		// values before ...body are default and can be overriden
// 		position: 0,
// 		hoist: false,
// 		color: 0,
// 		mentionable: false,
// 		...body,
// 		guild_id: guild_id,
// 		managed: false,
// 		permissions: String(req.permission!.bitfield & BigInt(body.permissions || "0")),
// 		tags: undefined,
// 		icon: null,
// 		unicode_emoji: null
// 	});

// 	await Promise.all([
// 		role.save(),
// 		emitEvent({
// 			event: "GUILD_ROLE_CREATE",
// 			guild_id,
// 			data: {
// 				guild_id,
// 				role: role
// 			}
// 		} as GuildRoleCreateEvent)
// 	]);

// 	res.json(role);
// });

// router.delete("/:role_id", route({ permission: "MANAGE_ROLES" }), async (req: Request, res: Response) => {
// 	const guild_id = req.params.guild_id;
// 	const { role_id } = req.params;
// 	if (role_id === guild_id) throw new HTTPError("You can't delete the @everyone role");

// 	await Promise.all([
// 		Role.delete({
// 			id: role_id,
// 			guild_id: guild_id
// 		}),
// 		emitEvent({
// 			event: "GUILD_ROLE_DELETE",
// 			guild_id,
// 			data: {
// 				guild_id,
// 				role_id
// 			}
// 		} as GuildRoleDeleteEvent)
// 	]);

// 	res.sendStatus(204);
// });

// // TODO: check role hierarchy

// router.patch("/:role_id", route({ body: "RoleModifySchema", permission: "MANAGE_ROLES" }), async (req: Request, res: Response) => {
// 	const { role_id, guild_id } = req.params;
// 	const body = req.body as RoleModifySchema;

// 	if (body.icon) body.icon = await handleFile(`/role-icons/${role_id}`, body.icon as string); 

// 	const role = new Role({
// 		...body,
// 		id: role_id,
// 		guild_id,
// 		permissions: String(req.permission!.bitfield & BigInt(body.permissions || "0"))
// 	});

// 	await Promise.all([
// 		role.save(),
// 		emitEvent({
// 			event: "GUILD_ROLE_UPDATE",
// 			guild_id,
// 			data: {
// 				guild_id,
// 				role
// 			}
// 		} as GuildRoleUpdateEvent)
// 	]);

// 	res.json(role);
// });

// router.patch("/", route({ body: "RolePositionUpdateSchema" }), async (req: Request, res: Response) => {
// 	const { guild_id } = req.params;
// 	const body = req.body as RolePositionUpdateSchema;

// 	const perms = await getPermission(req.user_id, guild_id);
// 	perms.hasThrow("MANAGE_ROLES");

// 	await Promise.all(body.map(async (x) => Role.update({ guild_id, id: x.id }, { position: x.position })));

// 	const roles = await Role.find({ where: body.map((x) => ({ id: x.id, guild_id })) });

// 	await Promise.all(
// 		roles.map((x) =>
// 			emitEvent({
// 				event: "GUILD_ROLE_UPDATE",
// 				guild_id,
// 				data: {
// 					guild_id,
// 					role: x
// 				}
// 			} as GuildRoleUpdateEvent)
// 		)
// 	);

// 	res.json(roles);
// });

export default router;