# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Guest'
        db.create_table(u'event_guest', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
        ))
        db.send_create_signal(u'event', ['Guest'])

        # Adding model 'Product'
        db.create_table(u'event_product', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('required_quantity', self.gf('django.db.models.fields.IntegerField')(default=1)),
        ))
        db.send_create_signal(u'event', ['Product'])

        # Adding model 'Event'
        db.create_table(u'event_event', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('date', self.gf('django.db.models.fields.DateTimeField')()),
            ('place', self.gf('django.db.models.fields.CharField')(max_length=1000)),
        ))
        db.send_create_signal(u'event', ['Event'])

        # Adding model 'Attending'
        db.create_table(u'event_attending', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('guest', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Guest'])),
            ('event', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Event'])),
            ('product', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['event.Product'])),
            ('quantity', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'event', ['Attending'])

        # Adding unique constraint on 'Attending', fields ['guest', 'event', 'product']
        db.create_unique(u'event_attending', ['guest_id', 'event_id', 'product_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'Attending', fields ['guest', 'event', 'product']
        db.delete_unique(u'event_attending', ['guest_id', 'event_id', 'product_id'])

        # Deleting model 'Guest'
        db.delete_table(u'event_guest')

        # Deleting model 'Product'
        db.delete_table(u'event_product')

        # Deleting model 'Event'
        db.delete_table(u'event_event')

        # Deleting model 'Attending'
        db.delete_table(u'event_attending')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'event.attending': {
            'Meta': {'unique_together': "(('guest', 'event', 'product'),)", 'object_name': 'Attending'},
            'event': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Event']"}),
            'guest': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Guest']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['event.Product']"}),
            'quantity': ('django.db.models.fields.IntegerField', [], {'default': '0'})
        },
        u'event.event': {
            'Meta': {'object_name': 'Event'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'guest_list': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['event.Guest']", 'through': u"orm['event.Attending']", 'symmetrical': 'False'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'place': ('django.db.models.fields.CharField', [], {'max_length': '1000'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'event.guest': {
            'Meta': {'object_name': 'Guest'},
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'event.product': {
            'Meta': {'object_name': 'Product'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'required_quantity': ('django.db.models.fields.IntegerField', [], {'default': '1'})
        }
    }

    complete_apps = ['event']