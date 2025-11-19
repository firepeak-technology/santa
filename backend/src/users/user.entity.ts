import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Group } from '../groups/group.entity';
import { Wishlist } from '../wishlists/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  uniqueLink: string;

  @ManyToOne(() => Group, group => group.users)
  group: Group;

  @ManyToOne(() => User, { nullable: true })
  drawnUser: User;

  @OneToMany(() => Wishlist, wishlist => wishlist.user)
  wishlist: Wishlist[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
