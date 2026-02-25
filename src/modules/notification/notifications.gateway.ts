import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwt: JwtService) {}

  async handleConnection(client: Socket) {
    // socket.io v4: token recommended di handshake.auth
    const tokenFromAuth = client.handshake.auth?.token as string | undefined;

    // fallback kalau kamu pakai query token: ?token=xxx
    const tokenFromQuery = client.handshake.query?.token as string | undefined;

    // fallback header: Authorization: Bearer xxx
    const authHeader = client.handshake.headers?.authorization;
    const tokenFromHeader =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : undefined;

    const token = tokenFromAuth || tokenFromQuery || tokenFromHeader;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: any = await this.jwt.verifyAsync(token);
      const userId = payload.sub;

      if (!userId) {
        console.log('[WS] payload.sub kosong');
        client.disconnect(true);
        return;
      }

      client.data.userId = userId;
      client.join(userId);
      console.log('[WS] joined room', userId);
    } catch (e: any) {
      console.log('[WS] JWT verify gagal:', e?.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {}

  notifyUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }

  isUserOnline(userId: string) {
    const room = this.server?.sockets?.adapter?.rooms?.get(userId);
    return (room?.size ?? 0) > 0;
  }
}
